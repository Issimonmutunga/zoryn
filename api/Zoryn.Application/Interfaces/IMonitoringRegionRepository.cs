using Zoryn.Domain.Entities;

namespace Zoryn.Application.Interfaces;

public interface IMonitoringRegionRepository
{
    Task<MonitoringRegion?> GetByIdAsync(Guid id);

    Task<IReadOnlyList<MonitoringRegion>> GetAllAsync();

    Task AddAsync(MonitoringRegion region);

    Task UpdateAsync(MonitoringRegion region);

    Task DeleteAsync(Guid id);
}