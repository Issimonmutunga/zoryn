using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Zoryn.Domain.Entities;
using Zoryn.Infrastructure.Identity;

namespace Zoryn.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<MonitoringRegion> MonitoringRegions => Set<MonitoringRegion>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<MonitoringRegion>(region =>
        {
            region.HasKey(r => r.Id);

            // Ids are assigned by the domain, not the database.
            region.Property(r => r.Id).ValueGeneratedNever();

            region.Property(r => r.Name)
                .HasMaxLength(MonitoringRegion.MaxNameLength)
                .IsRequired();
        });
    }
}