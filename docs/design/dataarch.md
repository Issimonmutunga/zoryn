# Zoryn — Data Architecture

> **Status:** Authoritative architecture
> **Scope:** Database, identity, authorization, spatial data, scientific data, storage, and persistence
> **Stack:** ASP.NET Core 8 · EF Core 8 · PostgreSQL · PostGIS · ASP.NET Core Identity

---

## 1. Purpose

Zoryn is an environmental intelligence platform.

Its data architecture must support:

- User accounts and authentication.
- Organizations and access control.
- Monitoring regions and spatial operations.
- Environmental observations.
- Hazard and risk assessments.
- Climate scenarios and model runs.
- Large scientific datasets.
- Alerts and notifications.
- Auditing and scientific reproducibility.

The architecture must work:

```text
Local development
      ↓
Free / low-cost deployment
      ↓
Production
      ↓
Large-scale deployment
````

without requiring a fundamental database rewrite.

---

# 2. Core Architecture

```text
┌──────────────────────────────┐
│            API               │
│ Controllers · DTOs · Auth    │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│        Application           │
│ Use cases · Validation       │
│ Authorization · Services     │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│       Infrastructure         │
│ EF Core · Identity           │
│ PostgreSQL · PostGIS         │
│ Object Storage               │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│           Domain             │
│ Entities · Rules · Invariants│
└──────────────────────────────┘
```

### Rules

* Domain does not depend on EF Core, Identity, PostgreSQL, or other infrastructure.
* EF Core lives in Infrastructure.
* Identity lives in Infrastructure.
* Controllers do not access the database directly.
* APIs return DTOs, not database entities.
* Large scientific files are not stored inside PostgreSQL.

---

# 3. Database

## Decision

**PostgreSQL + PostGIS is the primary database.**

Local development will also use PostgreSQL + PostGIS, preferably through Docker.

```text
Developer machine
      │
      └── Docker
           │
           └── PostgreSQL + PostGIS
```

We will **not use SQLite** as the application database.

### Why

Zoryn is fundamentally spatial.

PostGIS provides:

* Geometry storage.
* Spatial indexes.
* Spatial intersection.
* Containment.
* Distance calculations.
* Geographic queries.

Using PostgreSQL locally also keeps development and production environments aligned.

---

# 4. Identity

Zoryn will use:

**ASP.NET Core Identity**

We will not build custom password or authentication systems.

```text
ApplicationUser
      │
      ├── Identity credentials
      ├── Roles / claims
      ├── Organization membership
      ├── Sessions / refresh tokens
      └── Audit history
```

Identity uses `Guid` keys.

`ApplicationUser` remains intentionally small.

Profile, organization membership, alerts, and other application concerns belong in separate tables.

### Authentication

The API will use:

* JWT bearer authentication.
* Short-lived access tokens.
* Rotating refresh tokens.
* Hashed refresh tokens.
* Token revocation.
* Email confirmation.
* Password reset.
* Account lockout.
* MFA when enabled/required.

Authentication secrets must never be stored in plaintext.

---

# 5. Authorization

Authorization has three levels:

```text
Identity
   ↓
Organization membership
   ↓
Resource authorization
```

### Organization roles

Initial roles:

```text
Administrator
Analyst
Viewer
```

Roles are **organization-scoped**.

A user may therefore be:

```text
Administrator → Organization A
Viewer        → Organization B
```

ASP.NET Identity's global roles are not used for organization membership.

### Authorization model

Use:

* Roles for broad permissions.
* Claims for cross-cutting permissions.
* ASP.NET resource-based authorization for resource-specific access.

Initially:

```text
Organization role
       ↓
Access to organization's regions
```

Per-region access-control overrides will only be introduced when there is a real requirement.

---

# 6. Organizations

Zoryn is designed for multi-organization use.

Core relationship:

```text
User
 │
 └── OrganizationMember
          │
          └── Organization
                  │
                  ├── MonitoringRegion
                  ├── Alerts
                  ├── Datasets
                  └── Risk data
```

Business entities that may require tenant isolation will contain:

```text
OrganizationId
```

Multi-tenancy is designed into the schema from the beginning.

Full PostgreSQL Row-Level Security is **not required for Phase 1**.

Application-layer authorization is the initial isolation mechanism.

---

# 7. Monitoring Regions

A monitoring region is a user-defined geographic area monitored by Zoryn.

```text
MonitoringRegion
├── Id
├── OrganizationId
├── Name
├── Description
├── Geometry
├── AreaKm2
├── H3Resolution
├── IsActive
├── CreatedAt
├── UpdatedAt
├── CreatedBy
└── UpdatedBy
```

### Geometry

Use:

```text
MultiPolygon
SRID 4326
```

The region geometry is the **source of truth**.

A PostGIS GiST index will support spatial queries.

---

# 8. H3

H3 is used as a spatial indexing and environmental-data join mechanism.

The region geometry remains authoritative.

H3 cells are derived from it.

```text
MonitoringRegion
      │
      │ polyfill
      ↓
MonitoringRegionH3Cell
      │
      ↓
EnvironmentalObservation
      │
      ↓
Risk / Hazard calculations
```

Conceptually:

```text
MonitoringRegionH3Cell

MonitoringRegionId  → MonitoringRegion
H3Index             → bigint
Resolution          → smallint
```

H3 cells are regenerated whenever the region geometry changes.

H3 is **not** a replacement for the region geometry.

---

# 9. Environmental Data

Zoryn will separate data by purpose.

| Data                   | Storage              |
| ---------------------- | -------------------- |
| Users                  | PostgreSQL           |
| Organizations          | PostgreSQL           |
| Regions                | PostgreSQL + PostGIS |
| Spatial relationships  | PostgreSQL           |
| Application metadata   | PostgreSQL           |
| Queryable observations | PostgreSQL           |
| Risk summaries         | PostgreSQL           |
| Large rasters          | Object storage       |
| NetCDF                 | Object storage       |
| GeoTIFF                | Object storage       |
| Large Parquet datasets | Object storage       |
| Model artifacts        | Object storage       |

The fundamental rule is:

> **PostgreSQL stores data that the application needs to query relationally. Object storage stores large files.**

---

# 10. Environmental Observations

Queryable environmental observations may be stored in PostgreSQL.

Conceptual structure:

```text
EnvironmentalObservation
├── Id
├── DatasetId
├── Variable
├── H3Index
├── Timestamp
├── Value
├── Unit
├── Source
└── QualityFlag
```

Large observation datasets will use PostgreSQL partitioning, primarily by time.

The expected query pattern is:

```text
H3 cell
   +
Variable
   +
Time range
```

Therefore indexes will be designed around that access pattern.

Bulk ingestion will use efficient PostgreSQL/Npgsql mechanisms rather than inserting millions of rows individually through ordinary EF Core operations.

---

# 11. Scientific Data

Large source datasets are stored outside PostgreSQL.

```text
Dataset
   │
   ├── Source
   ├── License
   ├── Version
   ├── StorageUri
   ├── Checksum
   └── Metadata
          │
          ↓
     Object Storage
          │
          ├── NetCDF
          ├── GeoTIFF
          ├── Parquet
          └── Model artifacts
```

PostgreSQL stores the metadata and reference.

It does not store the multi-gigabyte scientific file itself.

---

# 12. Object Storage

Object storage will be accessed through an application abstraction.

Conceptually:

```text
Application
     ↓
IObjectStorage
     ↓
Infrastructure
     ↓
R2 / S3 / equivalent
```

The initial preferred solution is:

**Cloudflare R2**

Supabase Storage remains a practical alternative if keeping database and storage under one provider is more valuable.

The application must not depend directly on a specific storage provider.

---

# 13. Hazards

Hazards are separate from environmental observations.

Target structure:

```text
HazardType
     ↓
Hazard
     ↓
HazardModel
     ↓
ModelRun
     ↓
HazardAssessment
     ↓
RiskAssessment
```

Examples of hazard types may include:

* Flood
* Drought
* Extreme heat
* Cyclone / wind
* Wildfire
* Water security

Only the entities required by the current implementation phase will be created.

---

# 14. Climate Scenarios

Climate information must remain traceable.

Conceptually:

```text
Dataset
   +
ClimateModel
   +
Scenario
   +
ProcessingVersion
   +
Parameters
   ↓
ModelRun
```

Example scenarios:

```text
Historical
SSP245
SSP370
SSP585
```

A model run represents a specific execution and must be reproducible.

---

# 15. Model Runs

`ModelRun` is a central scientific provenance record.

A model run identifies:

* Dataset.
* Climate model.
* Scenario.
* Processing version.
* Execution time.
* Parameters.
* Time period.

```text
Dataset
ClimateModel
Scenario
    │
    └──────→ ModelRun
                │
                ├── HazardAssessment
                └── RiskAssessment
```

Historical model outputs must not silently change.

If the model or processing pipeline changes, create a **new ModelRun**.

---

# 16. Risk Assessments

Risk results are stored as versioned outputs.

```text
MonitoringRegion
       │
       ↓
RiskAssessment
       │
       └── ModelRun
              │
              ├── Dataset
              ├── ClimateModel
              ├── Scenario
              └── ProcessingVersion
```

This allows Zoryn to answer:

> "Why did this risk value exist?"

months or years later.

Risk results should not be recomputed on every API request.

---

# 17. Alerts

Target structure:

```text
Environmental data
        ↓
Risk / hazard result
        ↓
AlertRule
        ↓
AlertEvent
        ↓
AlertRecipient
        ↓
Notification
```

Potential notification channels:

* In-app.
* Email.
* SMS later.
* Webhooks later.

Alert functionality will be introduced after the core data foundation.

---

# 18. Auditing

Important application actions must be auditable.

```text
AuditLog
├── Id
├── UserId
├── OrganizationId
├── Action
├── ResourceType
├── ResourceId
├── Timestamp
├── Success
├── IP information
└── Metadata
```

Do not store:

* Passwords.
* Access tokens.
* Refresh tokens.
* Secrets.

Audit data will eventually be partitioned by time.

---

# 19. IDs

Use identifiers according to workload.

### UUID / UUIDv7

For normal application entities:

```text
User
Organization
MonitoringRegion
Dataset
ModelRun
RiskAssessment
Alert
```

Time-ordered UUIDs are preferred where practical.

### bigint

For very large append-heavy tables:

```text
EnvironmentalObservation
AuditLog
```

This reduces index/storage overhead and improves insert locality.

---

# 20. Time

All timestamps use UTC.

PostgreSQL:

```text
timestamptz
```

Application timestamps:

```text
CreatedAt
UpdatedAt
```

User-facing timezone conversion happens outside the database.

---

# 21. Concurrency

Optimistic concurrency will be used.

PostgreSQL's `xmin` may be used for EF Core concurrency tracking where appropriate.

The goal is to prevent:

```text
User A reads version 1
User B reads version 1

User A saves
User B accidentally overwrites A
```

---

# 22. Deletion

Deletion strategy depends on the entity.

Soft deletion is appropriate for entities whose historical relationships must remain available.

Examples:

```text
Organization
MonitoringRegion
AlertRule
```

Temporary/security records such as refresh tokens can be permanently removed according to retention policy.

Identity's own account-management mechanisms should be used rather than creating duplicate user-deletion systems.

---

# 23. EF Core

EF Core 8 is the persistence layer.

Core packages:

```text
Microsoft.EntityFrameworkCore
Npgsql.EntityFrameworkCore.PostgreSQL
Npgsql.EntityFrameworkCore.PostgreSQL.NetTopologySuite
Microsoft.AspNetCore.Identity.EntityFrameworkCore
```

Rules:

* EF Core stays in Infrastructure.
* Use Fluent API configurations.
* Use migrations.
* No generic repository layer.
* Use domain-specific repositories only where they provide real value.
* Use DTO projections for API reads.
* Use `AsNoTracking()` for read-only queries.
* Use explicit transactions only when genuinely required.

---

# 24. Migrations

Database schema changes are managed through:

```text
EF Core Migrations
```

Development:

```text
Create migration
       ↓
Review migration
       ↓
Apply migration
```

Production migrations should be explicitly deployed.

Do not automatically mutate the production database on application startup.

---

# 25. Security Principles

Security is built into the architecture rather than added later.

### Required principles

* Least privilege.
* HTTPS.
* Secure secrets management.
* Environment variables for credentials.
* Password hashing through Identity.
* MFA support.
* Account lockout.
* JWT expiration.
* Refresh-token rotation.
* Refresh-token hashing.
* Authorization policies.
* Organization isolation.
* Parameterized database access through EF Core/Npgsql.
* Audit logging.
* Database encryption in transit.
* No secrets committed to Git.

---

# 26. Performance Principles

Design for growth without premature complexity.

Important techniques:

```text
Correct indexes
      ↓
Efficient queries
      ↓
Pagination
      ↓
Partitioning
      ↓
Bulk ingestion
      ↓
Caching when measured necessary
```

Important indexes include:

* PostGIS GiST indexes.
* Foreign-key indexes.
* H3 indexes.
* Time indexes.
* Composite H3/variable/time indexes.

Caching is introduced only when a real performance bottleneck is measured.

---

# 27. Local → Deployment Architecture

### Local

```text
Windows
  ↓
Docker
  ↓
PostgreSQL + PostGIS
```

### Initial hosted deployment

```text
ASP.NET API
     │
     ├────────→ Supabase PostgreSQL + PostGIS
     │
     └────────→ Cloudflare R2
```

### Production

```text
ASP.NET API
     │
     ├────────→ Managed PostgreSQL + PostGIS
     │
     └────────→ R2 / S3
```

The following should remain constant:

```text
Domain model
Application architecture
EF Core model
Database migrations
Identity model
Object-storage abstraction
```

Infrastructure sizing and connection strings are what change.

---

# 28. Backups

Local development is disposable.

Hosted environments require:

* Automated database backups.
* Independent database dumps.
* Object-storage versioning.
* Restore testing.
* Documented recovery procedures.

Point-in-time recovery becomes important when the system moves to a production tier.

---

# 29. Phase 1 — Database Foundation

Do not build the entire target schema immediately.

Phase 1 contains:

```text
ASP.NET Core Identity
        │
        ├── ApplicationUser
        ├── Roles / Claims
        └── Authentication

Organization
        │
        └── OrganizationMember

MonitoringRegion
        │
        └── MonitoringRegionH3Cell

RefreshToken

AuditLog
```

No premature tables for:

```text
HazardModel
ModelRun
HazardAssessment
RiskAssessment
Alert
EnvironmentalObservation
```

unless the current implementation actually requires them.

---

# 30. Target Architecture

Eventually:

```text
                         ┌──────────────┐
                         │    Users     │
                         └──────┬───────┘
                                │
                         Organization
                                │
                  ┌─────────────┴─────────────┐
                  │                           │
          MonitoringRegion               Alerts
                  │
             PostGIS Geometry
                  │
              H3 Cells
                  │
        EnvironmentalObservation
                  │
              HazardModel
                  │
               ModelRun
                  │
           HazardAssessment
                  │
            RiskAssessment
                  │
              Zoryn API
```

Large scientific files follow a separate path:

```text
Dataset metadata
       │
       ↓
PostgreSQL
       │
       └────────── Storage URI
                       │
                       ↓
                 Object Storage
                       │
              ┌────────┼────────┐
              ↓        ↓        ↓
            NetCDF   GeoTIFF  Parquet
```

---

# 31. Architectural Rules

These rules are authoritative.

1. **PostgreSQL + PostGIS is Zoryn's primary database.**
2. **ASP.NET Core Identity handles authentication.**
3. **Organizations provide the primary tenant boundary.**
4. **Monitoring region geometry is authoritative; H3 is derived.**
5. **Large scientific files belong in object storage.**
6. **Queryable environmental data may belong in partitioned PostgreSQL tables.**
7. **Scientific outputs must be traceable to their ModelRun.**
8. **EF Core belongs in Infrastructure.**
9. **APIs expose DTOs, not persistence entities.**
10. **Security and authorization are enforced at the application boundary.**
11. **The Phase 1 database remains deliberately small.**
12. **Every future schema addition must have a clear purpose and ownership model.**

---

# 32. Immediate Implementation Order

Once this architecture is approved:

```text
1. PostgreSQL + PostGIS
          ↓
2. EF Core + ApplicationDbContext
          ↓
3. ASP.NET Core Identity
          ↓
4. Authentication
          ↓
5. Organizations
          ↓
6. Organization membership
          ↓
7. Monitoring regions
          ↓
8. H3 relationships
          ↓
9. Refresh tokens
          ↓
10. Auditing
```

Each step should be implemented incrementally, tested, built, and committed before moving to the next.

---

## Final Principle

> **Zoryn's database is the system of record for application state, spatial entities, metadata, and queryable derived data. Object storage is the system of record for large scientific files. Identity secures the system, organizations establish ownership, PostGIS establishes spatial truth, H3 enables efficient spatial joins, and ModelRun establishes scientific reproducibility.**

