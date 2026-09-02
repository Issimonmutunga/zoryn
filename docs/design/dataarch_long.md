# Zoryn — Data Architecture & Persistence Design

*ASP.NET Core 8 / PostgreSQL+PostGIS / Enterprise-quality, cheap-to-start*

---

## A. Recommended Architecture

```
API (controllers, DTOs, auth)
 ↓
Application (use cases, validation, orchestration)
 ↓
Infrastructure (EF Core, PostgreSQL, PostGIS, object storage, Identity)
 ↓
Domain (entities, value objects, invariants — no EF, no framework refs)
```

**Core stack decision:**

| Layer | Choice | Why |
|---|---|---|
| RDBMS | PostgreSQL 16 + PostGIS | Spatial queries are core to Zoryn, not optional |
| Local dev | PostgreSQL in Docker (not SQLite) | Dev/prod parity — see §1 |
| ORM | EF Core 8, `Npgsql.EntityFrameworkCore.PostgreSQL` + `NetTopologySuite` | Native PostGIS support |
| Auth | ASP.NET Core Identity, custom `ApplicationUser` | Don't reinvent password/token handling |
| API auth | JWT bearer + rotating refresh tokens | You're API-first; cookies don't fit a future mobile/3rd-party client |
| Large binary/scientific data | Object storage (R2/S3-compatible), **not** Postgres | Rasters/NetCDF don't belong in a relational DB |
| Background/derived data | Computed on demand, cached, versioned — not live-recomputed per request | Reproducibility + performance |

This gives you one data model that scales from "solo dev on a laptop" to "multi-org production" without a rewrite — the thing you explicitly asked to avoid.

---

## 1. Database Technology

**PostgreSQL + PostGIS is correct, and not a close call.** Zoryn's entire value proposition is spatial (regions, hazards, risk over geography). SQL Server/MySQL would mean bolting on weaker spatial extensions later. Postgres also gives you JSONB (for flexible model-output metadata), native partitioning, and row-level security if you ever need it.

**SQLite locally — recommend against it.** It's tempting for "zero setup," but:
- No PostGIS. You'd fake geometry with plain columns locally and real geometry in prod — exactly the divergence you said to avoid.
- EF Core migrations behave differently enough between SQLite and Postgres providers that "works locally, breaks in prod" bugs are common.
- **Verdict: PostgreSQL + PostGIS via Docker Compose from day one.** One `docker-compose.yml`, one connection string shape, dev = prod schema.

**Docker for local Postgres:** yes — use the official `postgis/postgis` image. Trivial to reset (`docker compose down -v && up`), which directly serves your §24 "easy reset" requirement.

**Local → hosted migration path:** because you're on vanilla Postgres+PostGIS with EF Core migrations (no SQLite-specific quirks), moving to a hosted provider is a connection-string change, not a rewrite. Options, cheapest-first:

| Provider | Free tier reality | PostGIS? | Notes |
|---|---|---|---|
| **Supabase** | 500MB DB, pauses after inactivity | Yes, built-in | Best free option for you — Postgres + PostGIS + Storage (S3-compatible) in one place |
| **Neon** | 512MB–3GB, branching | Yes | Great for preview/branch DBs per PR later |
| **Railway** | Small free credit, then usage-billed | Yes | Simple, no pause-on-idle like Supabase |
| **Fly.io Postgres** | Small free allowance | Yes | More ops overhead |
| **Azure/AWS RDS** | No real free tier | Yes | Fine once you have revenue/budget |

**My recommendation: Supabase for Postgres+PostGIS AND object storage**, since it collapses two infrastructure decisions into one account and free tier, and its Storage product is S3-compatible so you're not locked in.

**Scaling path / size limits:** free tiers cap around 500MB–3GB. Your bottleneck will be `EnvironmentalObservation`-style time-series rows, not app tables — which is exactly why raw observations/rasters go to object storage (§6/§8) and Postgres only holds indexed metadata and aggregates. That keeps you under free-tier limits far longer than a naive "store everything relationally" design.

**Connection pooling:** use Npgsql's built-in pooling (on by default) for the app; add **PgBouncer** (Supabase provides this automatically as port 6543) once you deploy, since serverless-style hosts (Azure App Service free tier, etc.) open/close connections aggressively.

**Backups/DR:** see §24.

**Migrations:** EF Core Migrations (Fluent API-driven), applied via a dedicated `dotnet ef database update` step in CI/CD, never via a mutable "runtime auto-migrate" in production (see §21).

---

## 2. Authentication & Users

**Use ASP.NET Core Identity's tables as-is; do not duplicate them.** `AspNetUsers`, `AspNetRoles`, `AspNetUserRoles`, `AspNetUserClaims`, `AspNetRoleClaims`, `AspNetUserLogins`, `AspNetUserTokens` already give you: password hashing, lockout, security stamp, 2FA secret storage, external login linking, and token storage. Reimplementing any of this is a security liability, not a feature.

**Extend, don't replace:**

```csharp
public class ApplicationUser : IdentityUser<Guid>
{
    public string DisplayName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
    // Profile/org-membership/alerts live in SEPARATE tables referencing this Id,
    // not bolted onto ApplicationUser itself.
}
```

Keep `ApplicationUser` thin. `UserProfile`, `OrganizationMember`, `Alert`, `AuditLog.UserId` all just FK to `AspNetUsers.Id`. This avoids Identity's table becoming a junk drawer.

**Decisions:**
- **IdentityUser key type: `Guid`, not `string`.** Default Identity uses `string` (GUID-as-string). Explicitly typing `IdentityUser<Guid>` gives you a real UUID column, consistent with the rest of your schema (§16).
- **Cookies vs JWT:** You said "API." Use **JWT bearer tokens** for the API, issued after Identity validates credentials. Add **refresh tokens** (stored hashed in `AspNetUserTokens` or a dedicated `RefreshToken` table — see below) with rotation on use and revocation on reuse-detection. Short-lived access token (~15 min), longer refresh token (~30 days), revocable.
- **Email confirmation, password reset, lockout, MFA:** all native Identity features — configure via `IdentityOptions`, don't build custom tables for them.
- **Session/device tracking:** Identity doesn't give you this out of the box. Add a small `UserSession` (or `RefreshToken`) table if you want "log out other devices" — this is genuinely optional for Phase 1, add when you need it.

**Do we need a custom `RefreshToken` table now?** Yes, minimally — Identity's `AspNetUserTokens` is designed for provider tokens (e.g. external logins), not really for rotating JWT refresh tokens with revocation metadata. A dedicated table is small and worth it:

```
RefreshToken
  Id (uuid, pk)
  UserId (fk -> AspNetUsers)
  TokenHash (not the raw token)
  ExpiresAt
  CreatedAt
  RevokedAt (nullable)
  ReplacedByTokenHash (nullable) -- rotation chain
  CreatedByIp
```

---

## 3. Authorization

**Roles alone are not sufficient — you need Roles + Claims + resource-based policies.** Reasoning: "Analyst can edit MonitoringRegion X but not Y" is a resource-level permission, not a role. Roles answer "what kind of user is this," policies answer "can this user act on this specific resource."

Recommended model:

```
User → OrganizationMember → Organization → OrganizationRole (Admin/Analyst/Viewer)
                                              ↓
                                     scoped to MonitoringRegion (optional finer grain)
```

- **Roles** (`Administrator`, `Analyst`, `Viewer`, `SystemService`) — coarse, org-scoped, stored via `OrganizationMember.Role` (an enum/lookup), *not* ASP.NET Identity global roles, because Identity roles are global to the user, not per-organization. A user can be Admin in Org A and Viewer in Org B.
- **Claims** — for cross-cutting flags that aren't org-scoped (e.g. `IsSystemAccount`, `IsPlatformSuperAdmin` for your own ops access).
- **Resource-based authorization (ASP.NET `IAuthorizationHandler`)** — for "can this user touch this specific `MonitoringRegion`," implemented as a policy that checks `OrganizationMember` + optional `MonitoringRegionAccess` override, not baked into the DB as a giant permission matrix.

**Do you need per-region ACLs on top of org roles now?** No — start with "org role determines access to all regions in that org." Add a `MonitoringRegionAccess` override table *only* when you have a real case of "Analyst A should see Region 1 but not Region 2 within the same org." Don't build it speculatively.

**Service/system accounts and future API clients:** model as regular `ApplicationUser` rows with a claim (`account_type = service`) rather than a parallel identity system — keeps auth code paths uniform. When you need real machine-to-machine auth (API keys, OAuth client_credentials), add an `ApiClient` table then; not needed for Phase 1.

---

## 4. Organizations / Tenancy

**Design for multi-tenancy now; don't fully implement isolation now.** Concretely:

- Add `Organization` and `OrganizationMember` tables in Phase 1, and put `OrganizationId` on every business table that will ever need tenant scoping (`MonitoringRegion`, `Alert`, `Dataset`, etc.) **from the start.**
- On user signup, auto-create a personal `Organization` for them (frictionless single-user UX, but the column is never nullable later).
- **Do not** implement Postgres row-level security (RLS) yet — it adds real operational complexity (session variables per request, policy testing) that buys you nothing while you're the only tenant. Enforce isolation at the Application layer (every query filtered by the caller's `OrganizationId` via a query filter / base repository) for now.
- **Why this matters:** retrofitting `OrganizationId` onto tables after they have data and foreign keys is a painful migration involving backfills and constraint rewrites. Retrofitting RLS after the app-layer filtering already works is comparatively cheap (it's an additive safety net, not a redesign). So: **column now, RLS later if you ever have adversarial multi-tenant conditions** (e.g., you sell to orgs who don't trust each other and want defense-in-depth).

```
User → OrganizationMember → Organization → MonitoringRegion (OrganizationId FK)
```

Cross-organization access (e.g., a consultant working across two client orgs) = just multiple `OrganizationMember` rows for that user. No special-casing needed.

**Challenge to your draft:** you listed `OrganizationRole` as a separate table. I'd collapse it into an enum column on `OrganizationMember` (`Admin`/`Analyst`/`Viewer`) rather than a full lookup table — you don't have a case yet for orgs defining *custom* roles, and a lookup table for a fixed 3-4 value set is unneeded indirection. Revisit if custom per-org roles become a real requirement.

---

## 5. Monitoring Regions

Your draft field list is close but I'd adjust it:

```
MonitoringRegion
  Id                uuid PK
  OrganizationId    uuid FK -> Organization
  Name              text
  Description       text (nullable)
  Geometry          geometry(MultiPolygon, 4326)   -- see below
  AreaKm2           numeric (computed/stored, not recomputed per query)
  H3Resolution      smallint                        -- see below
  IsActive          boolean default true
  CreatedAt / UpdatedAt / CreatedBy / UpdatedBy
```

**Polygon vs MultiPolygon:** use `MultiPolygon` always, even for single-polygon regions. Forces one consistent type; avoids "sometimes Polygon sometimes MultiPolygon" branching in every query and in NetTopologySuite mapping.

**SRID:** `4326` (WGS84 lat/lon) for storage — it's the universal interchange format and what your data sources (climate datasets, GeoJSON uploads) will already use. Reproject to a metric SRID only at query time for area/distance calculations if needed (`ST_Transform`).

**Spatial index:** GiST index on `Geometry` — non-negotiable for any `ST_Intersects`/`ST_Contains` query performance.

**H3 — this is the most important design decision in this section.** Recommendation: **store the region geometry as source of truth; store the covering H3 cells as a derived, indexed set — not as the primary representation.**

```
MonitoringRegionH3Cell
  MonitoringRegionId  uuid FK
  H3Index             bigint (H3 cells fit in 64 bits — don't store as text)
  Resolution          smallint
  PRIMARY KEY (MonitoringRegionId, H3Index)
```

Why both: the polygon is what the user drew/uploaded and what you show on a map; the H3 cell set is what makes joining region ↔ environmental-data ↔ risk-data *fast* (H3 index equality/containment is much cheaper than polygon intersection at scale, especially once you have millions of observation rows). Recompute the H3 cell set whenever geometry changes (a `MonitoringRegion.updated` domain event triggers `PolyfillAndStore`), rather than computing on every read.

**Chain this creates:**
```
MonitoringRegion.Geometry (authoritative, user-facing)
     ↓ polyfill (H3 library, done once on save)
MonitoringRegionH3Cell (derived, indexed, used for joins)
     ↓
EnvironmentalObservation.H3Index (join target)
     ↓
RiskAssessment (aggregated per region or per H3 cell)
```

Bounding-box: don't store a separate bbox column — `ST_Envelope(Geometry)` computed on demand, or rely on the GiST index which already accelerates bbox-style pre-filtering internally. Not worth a denormalized column at your current scale.

---

## 6. Environmental Data

**Not everything goes in Postgres — this is the single biggest architectural risk if done wrong.**

Split:

| Data | Where | Why |
|---|---|---|
| Region/hazard/risk **metadata**, spatial entities, indexes, computed summaries | PostgreSQL/PostGIS | Needs relational integrity, spatial queries, transactional consistency |
| Raw rasters, NetCDF, GeoTIFF, Parquet, large model output files | Object storage | Blob-shaped, large, not queried relationally — Postgres BLOB storage would bloat your DB and tank backup/restore times |
| Time-series point observations (post-extraction, tabular) | PostgreSQL, **partitioned** (see §8) | Structured, queryable, but partitioned to keep indexes manageable |

```
PostgreSQL/PostGIS  →  metadata + application state + spatial entities + indexed observations
Object storage       →  large rasters / NetCDF / Parquet / model artifacts (referenced by URI+checksum in Postgres)
```

Concretely: a `Dataset` row in Postgres has a `StorageUri` (object storage key) and `Checksum`; the actual multi-GB NetCDF file lives in object storage. Anything you need to *query* (a specific value at a specific H3 cell/time) gets extracted into `EnvironmentalObservation` rows at ingestion time — you don't query inside a NetCDF file at request time.

---

## 7. Object Storage

**Recommendation: Cloudflare R2**, with Supabase Storage as the pragmatic fallback if you want one vendor for everything.

| Option | Cost reality | Notes |
|---|---|---|
| **Cloudflare R2** | 10GB free, **zero egress fees** | Egress is the killer cost on most providers; R2 waives it. S3-compatible API. |
| Supabase Storage | 1GB free (bundled with your DB tier), scales with plan | Convenient if already using Supabase Postgres — one bill, one dashboard |
| AWS S3 | 5GB free (12 months only), then pay + egress | Egress costs add up fast for a data-heavy app like this |
| Local filesystem | Free | Only for local dev — never for anything you'll deploy, since most free app hosts have ephemeral disks |

**Abstraction — non-negotiable given your scale-up path:**

```csharp
public interface IObjectStorage
{
    Task<string> UploadAsync(string key, Stream content, string contentType, CancellationToken ct);
    Task<Stream> DownloadAsync(string key, CancellationToken ct);
    Task<Uri> GetPresignedUrlAsync(string key, TimeSpan expiry, CancellationToken ct);
    Task DeleteAsync(string key, CancellationToken ct);
}
```

Implement once against R2's S3-compatible API (`AWSSDK.S3` client pointed at R2's endpoint), and you can swap to real S3/Azure Blob later by writing a new implementation, not touching Application-layer code. This lives in `Infrastructure`.

---

## 8. Environmental Observations

**Relational, but partitioned — plain PostgreSQL partitioning, not TimescaleDB, unless you self-host.**

Reasoning: TimescaleDB is genuinely better for this workload (hypertables, native compression, continuous aggregates) — but it's **not available on Supabase's or most free-tier managed Postgres hosts** as an extension. Requiring it would break your "free tier now, upgrade later without rewrite" goal. Native Postgres declarative partitioning (by `RANGE (timestamp)`, monthly or yearly) gets you 80% of the benefit and works everywhere Postgres works. If you later self-host or move to a Timescale-enabled host, migrating a partitioned table to a hypertable is a much smaller lift than migrating from an unpartitioned table.

```
EnvironmentalObservation
  Id            bigint (identity, not uuid — see §16 rationale)
  DatasetId     uuid FK -> Dataset
  Variable      text  (e.g. 'temperature_2m', 'rainfall_mm')
  H3Index       bigint            -- primary spatial join key, NOT a geometry column
  Timestamp     timestamptz
  Value         double precision
  Unit          text
  Source        text
  QualityFlag   smallint
) PARTITION BY RANGE (Timestamp);
```

- **H3 index over geometry** for this table specifically — a point observation doesn't need a `POINT` geometry type when H3 gives you a fixed-size bigint that joins cheaply to `MonitoringRegionH3Cell`. Store `geometry(Point,4326)` only if you need to render exact point locations on a map; otherwise H3 alone is enough and much cheaper to index.
- **Composite index:** `(H3Index, Variable, Timestamp DESC)` — matches your dominant query pattern ("give me variable X for region Y over time range Z").
- **Retention/compression:** define a retention policy per dataset class (e.g., raw minute-level data retained 90 days, then rolled up to daily aggregates and the raw partition dropped). This is a Phase 6+ concern, not Phase 1 — but the partitioned design means "drop old partition" is a cheap operation when you get there (`DROP TABLE partition_2024_01` vs a slow `DELETE`).
- **Should raw observations live in object storage instead?** For *bulk raw model output* (rasters), yes (§6). For *point observations you actually query relationally*, no — that's exactly what this table is for. Don't push queryable tabular data into object storage; you'll end up reimplementing a query engine.

---

## 9. Hazards

Yes, these should be separate tables — collapsing them loses the reproducibility chain you explicitly care about (§25).

```
HazardType        (lookup: 'drought','flood','heat','cyclone','wildfire','water_security')
Hazard             — a specific hazard instance/definition tracked over time
HazardObservation  — an observed data point contributing evidence for a hazard (often FK's an EnvironmentalObservation)
HazardModel        — describes a modeling approach/algorithm (e.g. "SPI-based drought index v2")
ModelRun           — one execution of a HazardModel against a Dataset+Scenario+region+time
HazardAssessment   — the output: a hazard level/score for a region at a point in time, produced by a ModelRun
```

```
Hazard → HazardModel → ModelRun → Scenario → (spatial/temporal output) → RiskAssessment
```

**Do you need all six now?** Not for Phase 1 — `HazardType` and `Hazard` are cheap and worth having early (they're just lookups + a thin entity). `HazardModel`/`ModelRun`/`HazardAssessment` are Phase 6 concerns per your own phase plan — design the shape now (this document), implement when you actually have a model producing output. Building empty tables for a model you haven't written yet adds migration noise for no benefit.

---

## 10. Climate Scenarios

This is a **dimensional model** problem, not a normal CRUD schema — treat it like one:

```
ClimateModel     — e.g. "CMIP6 - MPI-ESM1-2", versioned
Scenario         — 'Historical', 'SSP245', 'SSP370', 'SSP585'
Dataset          — a specific published dataset (source, license, storage URI, checksum)
ModelRun         — Dataset + ClimateModel + Scenario + ProcessingVersion + Parameters + ExecutedAt
TimePeriod       — the temporal window a ModelRun's output covers (or just start/end columns on ModelRun — see below)
```

`ModelRun` is the pivot everything else hangs off (`HazardAssessment.ModelRunId`, `RiskAssessment.ModelRunId`) — this is what gives you "this risk number traces back to exactly this dataset+model+scenario+version" (§25).

**Challenge:** I'd fold `TimePeriod` into `ModelRun` as `PeriodStart`/`PeriodEnd` columns rather than a separate table, unless you expect the *same* run to be sliced into many distinct named periods independently reused elsewhere. A separate table is right only if `TimePeriod` needs its own identity (e.g., referenced by multiple runs as a shared vocabulary like "2050s", "2080s"). If that's the case — keep it separate; otherwise, simplify.

---

## 11. Risk Assessments

**Store computed results permanently, keyed by ModelRun; don't recompute on every request; don't store as raw files either — store as rows, because you need to query/filter/aggregate them.**

```
RiskAssessment
  Id                uuid
  MonitoringRegionId uuid FK  (nullable if H3-level instead — see below)
  H3Index           bigint (nullable if region-level instead)
  ModelRunId        uuid FK
  HazardTypeId      FK
  RiskScore         numeric
  ExposureScore     numeric
  VulnerabilityScore numeric
  ComputedAt        timestamptz
```

- **Region-level vs H3-level:** support both, but H3-level is the source of truth; region-level rows are a materialized aggregate over the region's H3 cell set (recomputed when either geometry or underlying H3-level scores change). This mirrors the geometry→H3 pattern from §5 — consistent design language across the schema.
- **Recompute vs cache:** cache permanently, invalidate/version by `ModelRunId` — never overwrite a `RiskAssessment` row in place. A new `ModelRun` produces new `RiskAssessment` rows; old ones stay for historical/audit comparison ("how did our risk estimate change when we updated the model"). This is what reproducibility actually requires.

---

## 12. Alerts

```
AlertRule       — user/org-defined condition (e.g. "notify if drought RiskScore > 0.7 in Region X")
AlertEvent      — a specific firing of a rule at a point in time
Alert           — I'd merge this concept into AlertEvent (see below)
AlertRecipient  — who gets notified for a given rule (user, or future: webhook/SMS target)
```

**Challenge to your draft:** `Alert` and `AlertEvent` as separate tables usually means one is redundant — either "Alert" is the persistent rule (== `AlertRule`) or it's an occurrence (== `AlertEvent`). I'd use exactly two tables: `AlertRule` (definition) and `AlertEvent` (each firing, with `AcknowledgedBy`/`AcknowledgedAt`/`Status`/`Severity`), plus `AlertRecipient` for delivery targets and `NotificationPreference` on the user for channel choice (email now; in-app/SMS/webhook are just new `DeliveryChannel` enum values later, not new tables).

```
Environmental data → Risk calculation → AlertRule (threshold check) → AlertEvent → notification dispatch
```

**Deduplication/rate limiting:** on `AlertEvent`, a unique constraint on `(AlertRuleId, DedupeWindowBucket)` where the bucket is e.g. a truncated timestamp — prevents the same condition firing 50 events in an hour. Simple and effective; no separate dedup infrastructure needed at your scale.

---

## 13. Auditing

```
AuditLog
  Id            bigint
  UserId        uuid (nullable — system actions have no user)
  OrganizationId uuid (nullable)
  Action        text ('Create','Update','Delete','Login','PermissionDenied',...)
  ResourceType  text ('MonitoringRegion','Alert',...)
  ResourceId    text
  Timestamp     timestamptz
  IpAddress     inet
  UserAgent     text
  Success       boolean
  Metadata      jsonb  (small structured context only — not full before/after payloads)
```

**Never log:** passwords, password hashes, security stamps, access/refresh tokens (raw or hashed), MFA secrets, any Identity token table content. Log the *fact* that an auth event happened, never the secret material involved.

**Retention:** keep detailed audit rows for a defined hot period (e.g. 1 year) in Postgres; beyond that, export/archive to object storage as compressed JSON/Parquet and drop from the hot table (via partitioning by month, same pattern as §8) — you almost never need sub-second query access to 3-year-old audit rows, but you may have compliance reasons to retain them cheaply.

---

## 14. Data Ownership

| Entity | Owner | Read | Modify | Delete |
|---|---|---|---|---|
| User | Self | Self, Org admins (limited) | Self | Self (soft) |
| Organization | Creator (becomes Admin) | Members | Admins | Admins (soft, see below) |
| MonitoringRegion | Organization | Org members per role | Admin/Analyst | Admin |
| Alert/AlertRule | Creating user, scoped to Organization | Org members | Creator, Admin | Creator, Admin |
| RiskAssessment | System-generated | Org members (read-only) | Never (immutable) | Never (retained for history) |
| Dataset | System/ingestion process | Org members if scoped, else global | Admin/system | Rare — mostly deprecate, not delete |

**User leaves an org:** `OrganizationMember` row deleted (hard delete — it's a pure join with no independent meaning); resources they created (`MonitoringRegion.CreatedBy`, etc.) stay, attributed to their user ID, which now just represents "a person no longer in this org" — don't cascade-delete their work.

**Organization deleted:** soft-delete the `Organization` (`IsDeleted`/`DeletedAt`), cascade soft-delete to its `MonitoringRegion`s, but **never cascade-delete `RiskAssessment`/`AuditLog`/historical scientific data** — those are retained for audit/history regardless of the owning org's lifecycle, with the FK relationship preserved (see §15 on cascade behavior).

---

## 15. Database Relationships & Cascade Behavior

| Relationship | Cardinality | Cascade on delete |
|---|---|---|
| User ↔ Organization (via OrganizationMember) | N:M | Restrict on Organization delete if it's the user's *only* org; else Cascade the membership row only |
| User ↔ Role | N:M (Identity native) | Cascade (Identity default) |
| User ↔ MonitoringRegion (via CreatedBy) | 1:N | **Restrict/SetNull** — never cascade-delete regions when a user is deleted |
| Organization ↔ MonitoringRegion | 1:N | Restrict (soft-delete org first, region stays) |
| MonitoringRegion ↔ Hazard/RiskAssessment | 1:N | **Restrict** — a region can't be hard-deleted while it has risk history; soft-delete only |
| MonitoringRegion ↔ Observation (via H3, not FK) | Indirect (join via H3Index) | N/A — no FK, so no cascade risk at all (deliberate design benefit) |
| RiskAssessment ↔ Scenario/ModelRun | N:1 | Restrict — a ModelRun can't be deleted if RiskAssessments reference it |
| User ↔ Alert(Rule) | 1:N | Cascade only the rule if user hard-deleted (rare); prefer reassigning to org on user departure |
| AlertRule ↔ AlertEvent | 1:N | Restrict — keep event history even if rule is later disabled/deleted (soft-delete rule instead) |

**General principle (matches your §15 concern directly): default to `Restrict` or `SetNull` on any FK pointing at scientific/audit data, and only use `Cascade` on true composition relationships (e.g., `OrganizationMember` rows, which have no meaning outside their parent).** EF Core: configure explicitly in `OnModelCreating` — never rely on the provider default, which is `Cascade` and is wrong for most of these.

---

## 16. Identifiers

**Recommendation: UUID (specifically UUIDv7, or ULID) for entity primary keys; `bigint identity` for high-volume time-series/log tables.**

| Type | Use for | Why |
|---|---|---|
| UUIDv7 | `MonitoringRegion`, `Organization`, `Alert`, `Dataset`, `RiskAssessment`, etc. | Sortable (unlike UUIDv4 — avoids index fragmentation), globally unique, safe to expose in public APIs without leaking sequence/volume info |
| `bigint identity` | `EnvironmentalObservation`, `AuditLog` | These tables will have millions+ rows; a `bigint` PK is 8 bytes vs 16 for UUID, and sequential inserts avoid B-tree fragmentation — meaningfully cheaper at this volume |
| Identity's native key | `AspNetUsers` etc. | Override to `Guid` (see §2) — consistent with the rest of the schema, still native to Identity |

**Why not plain UUIDv4 everywhere (your draft's implicit default):** random UUIDs as clustered/primary-key indexes cause index bloat and poor insert locality at scale — a well-known Postgres pain point. UUIDv7 (time-ordered) or ULID gets you the security/distributed-system benefits of UUIDs without that cost. Use Npgsql/`Guid.CreateVersion7()` (available in .NET 9; on .NET 8 use a small UUIDv7 helper library or generate via a Postgres `uuid_generate_v7` equivalent) or the `NewId`/`ULID` NuGet package.

---

## 17. Time & Auditing Fields

- **UTC everywhere, no exceptions.** Postgres `timestamptz` (not `timestamp`) for every timestamp column — it normalizes to UTC internally and converts on the way out, which is exactly what you want and avoids an entire class of timezone bugs.
- **Server-generated vs application-generated:** generate `CreatedAt`/`UpdatedAt` in the **application layer** (`DateTime.UtcNow` via an EF Core `SaveChanges` interceptor), not via Postgres `DEFAULT now()` — keeps timestamp logic testable and consistent even if you later add a caching/CQRS layer that bypasses direct DB writes.
- `CreatedBy`/`UpdatedBy`: `Guid?` FK to `AspNetUsers.Id`, nullable for system-generated rows (ingestion jobs, migrations).

---

## 18. Concurrency

**Use Postgres's native `xmin` system column as an implicit row-version, mapped via EF Core's concurrency token — don't add an explicit version column everywhere.**

```csharp
modelBuilder.Entity<MonitoringRegion>()
    .Property<uint>("xmin")
    .HasColumnType("xid")
    .IsRowVersion();
```

This gives you optimistic concurrency (an `UPDATE ... WHERE xmin = @original` under the hood, EF Core throws `DbUpdateConcurrencyException` on conflict) **with zero extra storage or migration work** — `xmin` already exists on every Postgres row. Reserve an explicit `RowVersion`/`Version` integer column only for entities where you want the version number to be meaningful to users (e.g., shown in an API response as "you're viewing v3") — not needed for Phase 1.

---

## 19. Soft Delete

**Not everywhere — apply it only where "deleted but still referenced" is a real requirement.**

| Entity | Soft delete? | Why |
|---|---|---|
| `Organization`, `MonitoringRegion`, `AlertRule` | **Yes** | Referenced by historical `RiskAssessment`/`AuditLog` rows that must remain valid/queryable |
| `User` (via Identity's `LockoutEnabled`, not a custom flag) | Use Identity's existing disable mechanism | Don't add a parallel `IsDeleted` next to Identity's own account-disable features |
| `RefreshToken`, `AlertEvent`, `AuditLog` | **No — hard delete or just expire** | Pure log/event data; nothing references *them*, so there's nothing to keep valid by soft-deleting |
| `OrganizationMember` (join table) | **No — hard delete** | It's a pure relationship; soft-deleting join rows just adds `WHERE IsDeleted = false` to every query for no benefit |

**Rule of thumb (worth stating explicitly since you flagged this):** soft-delete an entity only if something else holds a still-meaningful FK to it after "deletion." If nothing references it, hard-delete.

---

## 20. Security

| Concern | Approach | Environment |
|---|---|---|
| SQL injection | EF Core parameterized queries exclusively; no raw string-interpolated SQL | All |
| DB credentials | Separate least-privilege runtime role (`app_runtime`: DML only) vs migration role (`app_migrator`: DDL) | Staging/Prod |
| Secrets | `dotnet user-secrets` locally; environment variables / host secret manager (Supabase env, Azure Key Vault, etc.) in deployed environments — never in `appsettings.json` | Dev vs Staging/Prod |
| Password hashing | Identity's default (PBKDF2/Argon2 depending on version) — don't touch | All |
| MFA | Identity's built-in TOTP support | All, opt-in initially |
| Rate limiting | ASP.NET Core's built-in `Microsoft.AspNetCore.RateLimiting` middleware on auth endpoints especially | All |
| Lockout | Identity's `MaxFailedAccessAttempts`/`DefaultLockoutTimeSpan` | All |
| CORS | Explicit allowed-origins list, no wildcard once you have a real frontend origin | Staging/Prod |
| CSRF | Not applicable to a pure JWT-bearer API (no cookies = no CSRF vector); revisit only if you add a cookie-based admin panel | — |
| Cookies (if any used, e.g. refresh token delivery) | `HttpOnly`, `Secure`, `SameSite=Strict` | Staging/Prod |
| Transport | HTTPS enforced (`UseHttpsRedirection` + HSTS) everywhere except local Docker | Staging/Prod |
| DB encryption in transit | `sslmode=require` in the Npgsql connection string | Staging/Prod (most hosted Postgres requires this anyway) |
| Sensitive-data minimization | No PII beyond what's needed for auth/notifications; no storing of raw IPs longer than audit retention policy | All |

**Dev vs Staging vs Prod split:** Dev uses a local `app_dev` superuser-ish role for convenience (it's Docker, throwaway); Staging/Prod use the least-privilege split above, with connection strings injected via environment variables, never committed.

---

## 21. EF Core

- **Version:** EF Core 8.x (LTS, matches .NET 8).
- **Packages:** `Npgsql.EntityFrameworkCore.PostgreSQL`, `Npgsql.EntityFrameworkCore.PostgreSQL.NetTopologySuite` (for PostGIS geometry mapping), `Microsoft.AspNetCore.Identity.EntityFrameworkCore`.
- **DbContext structure:** one `ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid, ...>` living in `Infrastructure`. Identity tables and business tables in the *same* context/database — splitting them into separate contexts/databases adds cross-database transaction pain for no real benefit at your scale.
- **Configuration:** Fluent API in `IEntityTypeConfiguration<T>` classes, one per entity, not data annotations — keeps `Domain` entities free of EF/persistence attributes (matches your clean-architecture layering).
- **Migrations:** live in `Infrastructure`; applied via an explicit CI/CD step (`dotnet ef database update` against a migration-only credential), **not** `Database.Migrate()` called automatically on app startup in production — auto-migrate-on-boot is convenient in dev, dangerous in prod (races on multi-instance deploys, no review gate).
- **Seed data:** use `HasData()` only for truly static lookup data (e.g. `HazardType` rows), never for anything resembling sample/demo business data — and per your stated preference, **no synthetic/fake data generation anywhere in the codebase**; seed only real, known reference values (enum-like lookups), and leave actual environmental/business data to real ingestion or your own manual entry.
- **Design-time DbContext:** implement `IDesignTimeDbContextFactory<ApplicationDbContext>` so `dotnet ef` commands work without needing the full DI container / running app.
- **Repository pattern vs direct EF Core:** **skip a generic repository/UoW abstraction.** EF Core's `DbContext` already *is* a Unit of Work, and a generic repository on top of it typically just re-implements a worse version of `IQueryable`. Instead, put query logic in Application-layer "query handlers" or thin domain-specific repositories only where you genuinely need to hide complex spatial/H3 query logic behind a clean interface (e.g., `IMonitoringRegionRepository.FindByH3CellAsync(...)`) — targeted, not generic-for-everything.
- **Transactions:** rely on `SaveChanges()`'s implicit transaction for single-aggregate operations; use explicit `IDbContextTransaction` only for genuine multi-aggregate operations (e.g., "create Organization + create default OrganizationMember + create default MonitoringRegion" in one atomic step).

---

## 22. Performance

Likely-large tables, ranked: `EnvironmentalObservation` (by far), `AuditLog`, `MonitoringRegionH3Cell`, `AlertEvent`, `RiskAssessment`.

- **Indexes:** GiST on all `geometry` columns; B-tree on all FK columns (EF Core doesn't always add these automatically — verify); the `(H3Index, Variable, Timestamp DESC)` composite from §8.
- **Pagination:** keyset/cursor pagination (`WHERE Id > @lastId ORDER BY Id LIMIT n`) for `EnvironmentalObservation`/`AuditLog` — offset pagination degrades badly on large partitioned tables.
- **Projections:** always select DTOs via `.Select(...)`, never `.Include()` full graphs for read endpoints — matches your §26 DTO requirement anyway.
- **`AsNoTracking()`:** default for all read-only queries; only track entities you intend to mutate.
- **Bulk ingestion:** for observation ingestion, use `COPY` (via `Npgsql`'s binary copy API) rather than EF Core's row-by-row `SaveChanges()` — orders of magnitude faster for the volumes described in §8.
- **Partitioning:** already covered (§8) — this is your main defense against "large tables" becoming a problem at all.
- **Caching:** add an in-memory (`IMemoryCache`) or Redis cache layer only when you have a measured hot-path (e.g., "region risk summary" requested repeatedly) — not speculatively in Phase 1.

---

## 23. Free/Low-Cost Start → Production Path

```
LOCAL
  PostgreSQL + PostGIS (Docker)
       ↓  (same schema, same migrations)
Git → CI/CD (GitHub Actions)
       ↓
HOSTED
  Supabase Postgres+PostGIS (free tier)  +  Cloudflare R2 (object storage, free tier)
       ↓
HOSTED API
  Azure App Service Free/Basic tier, or Fly.io, or Railway — ASP.NET Core 8 container
       ↓
PRODUCTION (paid, when revenue/usage justifies it)
  Managed Postgres with real backups/HA (Azure Database for PostgreSQL, Neon Pro, etc.)
  + R2/S3 at scale
  + App Service Standard tier / Fly.io scaled
```

**What stays constant the entire way:** the schema, the EF Core migrations, the `IObjectStorage` abstraction, the Identity model. **What changes:** connection strings, environment variables, and infrastructure sizing. That's the whole point of this design — no "rip out SQLite" or "rip out roles-only auth" moment later.

**Free tier limitations to plan around now:** Supabase pauses inactive free projects (fine for a side project, annoying for a demo — a simple scheduled keep-alive ping avoids this); R2's free egress means you should genuinely put large files there rather than serving them through your API server, which usually has its own egress costs on the hosting side.

---

## 24. Backups & Recovery

- **Local dev:** no "backup" needed — Docker volume reset (`docker compose down -v`) *is* your recovery mechanism; keep a `seed-reference-data.sql` (real lookup values only, per your no-synthetic-data preference) to repopulate lookups after a reset.
- **Hosted (Supabase/Neon/etc.):** enable the provider's automated daily backups (available even on most free/low tiers, sometimes with shorter retention); additionally run a scheduled `pg_dump` to object storage (R2) weekly as a provider-independent backup you control — cheap insurance against a hosting provider issue.
- **Point-in-time recovery (PITR):** typically a paid-tier feature on managed Postgres hosts — not available on free tiers. Accept daily-backup-level RPO until you're on a paid tier; document this as a known limitation rather than over-engineering around it now.
- **Object storage backups:** R2/S3 versioning enabled on the bucket holding `Dataset` raw files — protects against accidental overwrite/delete of large source files that are expensive to re-fetch.
- **Restore testing:** treat "can I `docker compose up` a fresh Postgres and successfully run all migrations + restore a `pg_dump`" as a CI job, not a manual once-in-a-while check — cheap to automate, catches migration/backup drift early.

---

## 25. Data Versioning / Scientific Reproducibility

This is the through-line of §9–11 above, stated explicitly: every `RiskAssessment` (and `HazardAssessment`) row must be traceable via `ModelRunId` to:

```
Dataset (source, license, checksum, storage URI)
  + ClimateModel (name, version)
  + Scenario (SSP245, etc.)
  + ModelRun.ProcessingVersion (your own pipeline/code version — e.g. a git SHA or semver)
  + ModelRun.ExecutedAt
  + ModelRun.Parameters (jsonb — the specific config used for this run)
```

Practically: **never delete or mutate a `ModelRun` or its outputs.** If your model or pipeline changes, that's a *new* `ModelRun`, not an edit to an old one. This is what makes "why did our drought risk number change" answerable months later, and it's why §11's "recompute vs cache" answer was "cache permanently, version by run" rather than "always recompute live."

---

## 26. API Design Implications

The schema above supports exactly the REST shape you sketched, with one addition worth calling out: because `RiskAssessment`/`HazardAssessment` are versioned by `ModelRun`, endpoints like `GET /api/regions/{id}/risk` need an implicit "latest `ModelRun` per hazard type" query, not a naive "all rows." Plan for a `?asOf=` or `?modelRunId=` query parameter from the start so historical comparison is possible without an API redesign later.

**DTOs, always** — never return `MonitoringRegion` (with its `Geometry`, `xmin`, `OrganizationId`) directly; project to a `MonitoringRegionDto` in the Application layer. This is also where you'd serialize `Geometry` to GeoJSON for API consumers (NetTopologySuite → GeoJSON via `NetTopologySuite.IO.GeoJSON`).

---

## D–H. (Consolidated — see sections above)

- **D. Auth/authz model** → §2, §3
- **E. PostgreSQL/PostGIS strategy** → §1, §5
- **F. Environmental-data storage strategy** → §6, §8
- **G. Object-storage strategy** → §7
- **H. Security architecture** → §20

---

## J. Recommended Minimal Phase 1 Schema

Everything else in this document is the target shape. Phase 1 should implement **only**:

```
Identity (native):
  AspNetUsers (as ApplicationUser<Guid>), AspNetRoles, AspNetUserRoles,
  AspNetUserClaims, AspNetRoleClaims, AspNetUserLogins, AspNetUserTokens

Custom, minimal:
  RefreshToken
  Organization
  OrganizationMember        (UserId, OrganizationId, Role enum)
  MonitoringRegion           (Geometry, OrganizationId, audit fields, xmin concurrency)
  MonitoringRegionH3Cell     (derived from Geometry)
  AuditLog                   (partitioned by month from day one — cheap to do early, painful to retrofit)
```

That's it. No `Hazard`, `Dataset`, `ModelRun`, `RiskAssessment`, `Alert*` yet — those arrive in Phases 4–7 per your own phase plan, once there's real data flowing to justify their shape.

---

## K. Decisions You Need to Make Before Implementation

1. **Hosting pick:** Supabase (Postgres+PostGIS+Storage in one) vs Neon+R2 (best-of-breed but two vendors)? I lean Supabase for simplicity at your current stage — confirm.
2. **JWT vs a first-party web frontend needing cookies:** if Zoryn will also ship a server-rendered Razor/Blazor Server admin UI (not just a JS SPA/API consumer), you may want cookie auth *for that surface* alongside JWT for the API — worth deciding now since it affects Identity configuration.
3. **H3 resolution(s):** what resolution(s) do you standardize on for `MonitoringRegionH3Cell`/`EnvironmentalObservation`? This depends on your target region sizes (neighborhood vs country-scale) and isn't decidable in the abstract — needs your domain input.
4. **`OrganizationRole` as enum vs table:** confirmed as enum above — flag if you foresee custom per-org roles soon, since that changes the answer.
5. **MFA mandatory or optional at launch?** Affects Identity configuration and onboarding flow.
6. **Retention windows** for `AuditLog` and raw `EnvironmentalObservation` partitions — pick concrete numbers (e.g. 1 year hot / archive after) rather than leaving them open-ended, since partitioning strategy depends on it.
7. **First real data source:** what's the actual first dataset/API Zoryn will ingest (e.g., a specific reanalysis or forecast product)? This determines `Dataset`/`ClimateModel` field shapes concretely rather than abstractly, and I'd want to confirm the real source with you rather than assume one.

---

*Everything above avoids inventing example/sample data — the seed data mentioned in §21 and §24 refers only to genuine static lookup values (hazard types, roles), not placeholder business data. When you're ready to move to implementation, the next step is Phase 1 (Identity + database foundation) per §28 of your original spec.*