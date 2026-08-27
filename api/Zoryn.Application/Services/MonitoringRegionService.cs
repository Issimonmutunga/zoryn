using Zoryn.Application.DTOs;
using Zoryn.Application.Interfaces;
using Zoryn.Domain.Entities;

namespace Zoryn.Application.Services;

public sealed class MonitoringRegionService : IMonitoringRegionService
{
    private readonly IMonitoringRegionRepository _repository;

    public MonitoringRegionService(IMonitoringRegionRepository repository)
    {
        _repository = repository;
    }

    public async Task<MonitoringRegionDto?> GetByIdAsync(Guid id)
    {
        var region = await _repository.GetByIdAsync(id);

        return region is null
            ? null
            : new MonitoringRegionDto(region.Id, region.Name);
    }

    public async Task<IReadOnlyList<MonitoringRegionDto>> GetAllAsync()
    {
        var regions = await _repository.GetAllAsync();

        return regions
            .Select(region => new MonitoringRegionDto(region.Id, region.Name))
            .ToList();
    }

    public async Task<MonitoringRegionDto> CreateAsync(string name)
    {
        var region = new MonitoringRegion(Guid.NewGuid(), name);

        await _repository.AddAsync(region);

        return new MonitoringRegionDto(region.Id, region.Name);
    }

    public async Task<bool> UpdateAsync(Guid id, string name)
    {
        var region = await _repository.GetByIdAsync(id);

        if (region is null)
            return false;

        region.ChangeName(name);
        await _repository.UpdateAsync(region);

        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var region = await _repository.GetByIdAsync(id);

        if (region is null)
            return false;

        await _repository.DeleteAsync(id);

        return true;
    }
}