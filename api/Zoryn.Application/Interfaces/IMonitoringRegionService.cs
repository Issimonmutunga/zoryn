using Zoryn.Application.DTOs;

namespace Zoryn.Application.Interfaces;

public interface IMonitoringRegionService
{
    Task<MonitoringRegionDto?> GetByIdAsync(Guid id);

    Task<IReadOnlyList<MonitoringRegionDto>> GetAllAsync();

    Task<MonitoringRegionDto> CreateAsync(string name);

    Task<bool> UpdateAsync(Guid id, string name);

    Task<bool> DeleteAsync(Guid id);
}