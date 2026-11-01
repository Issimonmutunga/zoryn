using Microsoft.EntityFrameworkCore;
using Zoryn.Application.Interfaces;
using Zoryn.Domain.Entities;
using Zoryn.Infrastructure.Data;

namespace Zoryn.Infrastructure.Repositories;

public sealed class MonitoringRegionRepository : IMonitoringRegionRepository
{
    private readonly ApplicationDbContext _context;

    public MonitoringRegionRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public Task<MonitoringRegion?> GetByIdAsync(Guid id) =>
        _context.MonitoringRegions.FirstOrDefaultAsync(region => region.Id == id);

    public async Task<IReadOnlyList<MonitoringRegion>> GetAllAsync() =>
        await _context.MonitoringRegions
            .AsNoTracking()
            .OrderBy(region => region.Name)
            .ToListAsync();

    public async Task AddAsync(MonitoringRegion region)
    {
        _context.MonitoringRegions.Add(region);
        await _context.SaveChangesAsync();
    }

    // The region was loaded through this context, so its changes are tracked.
    public Task UpdateAsync(MonitoringRegion region) =>
        _context.SaveChangesAsync();

    public Task DeleteAsync(Guid id) =>
        _context.MonitoringRegions
            .Where(region => region.Id == id)
            .ExecuteDeleteAsync();
}
