using Zoryn.Application.Interfaces;
using Zoryn.Domain.Entities;

namespace Zoryn.Infrastructure.Repositories;

public sealed class MonitoringRegionRepository : IMonitoringRegionRepository
{
    private readonly List<MonitoringRegion> _regions = [];

    public Task<MonitoringRegion?> GetByIdAsync(Guid id)
    {
        var region = _regions.FirstOrDefault(x => x.Id == id);
        return Task.FromResult(region);
    }

    public Task<IReadOnlyList<MonitoringRegion>> GetAllAsync()
    {
        IReadOnlyList<MonitoringRegion> regions = _regions;
        return Task.FromResult(regions);
    }

    public Task AddAsync(MonitoringRegion region)
    {
        _regions.Add(region);
        return Task.CompletedTask;
    }

    public Task UpdateAsync(MonitoringRegion region)
    {
        return Task.CompletedTask;
    }

    public Task DeleteAsync(Guid id)
    {
        _regions.RemoveAll(x => x.Id == id);
        return Task.CompletedTask;
    }
}