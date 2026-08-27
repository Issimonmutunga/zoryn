using Microsoft.Extensions.DependencyInjection;
using Zoryn.Application.Interfaces;
using Zoryn.Infrastructure.Repositories;

namespace Zoryn.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services)
    {
        services.AddSingleton<IMonitoringRegionRepository, MonitoringRegionRepository>();

        return services;
    }
}