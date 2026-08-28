using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Zoryn.Application.Interfaces;
using Zoryn.Infrastructure.Data;
using Zoryn.Infrastructure.Identity;
using Zoryn.Infrastructure.Repositories;

namespace Zoryn.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        string connectionString)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(
                connectionString,
                npgsqlOptions => npgsqlOptions.UseNetTopologySuite()));

        services.AddIdentityCore<ApplicationUser>()
            .AddRoles<IdentityRole<Guid>>()
            .AddEntityFrameworkStores<ApplicationDbContext>();

        services.AddSingleton<IMonitoringRegionRepository, MonitoringRegionRepository>();

        return services;
    }
}