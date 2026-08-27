using Microsoft.Extensions.DependencyInjection;
using Zoryn.Application.Interfaces;
using Zoryn.Application.Services;

namespace Zoryn.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(
        this IServiceCollection services)
    {
        services.AddScoped<IEnvironmentService, EnvironmentService>();
        services.AddScoped<IMonitoringRegionService, MonitoringRegionService>();

        return services;
    }
}