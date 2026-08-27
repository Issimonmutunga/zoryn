using Microsoft.AspNetCore.Mvc;
using Zoryn.Application.DTOs;
using Zoryn.Application.Interfaces;

namespace Zoryn.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class MonitoringRegionsController : ControllerBase
{
    private readonly IMonitoringRegionService _service;

    public MonitoringRegionsController(IMonitoringRegionService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<MonitoringRegionDto>>> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<MonitoringRegionDto>> GetById(Guid id)
    {
        var region = await _service.GetByIdAsync(id);

        return region is null ? NotFound() : Ok(region);
    }

    [HttpPost]
    public async Task<ActionResult<MonitoringRegionDto>> Create(
        [FromBody] string name)
    {
        var region = await _service.CreateAsync(name);

        return CreatedAtAction(
            nameof(GetById),
            new { id = region.Id },
            region);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] string name)
    {
        var updated = await _service.UpdateAsync(id, name);

        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _service.DeleteAsync(id);

        return deleted ? NoContent() : NotFound();
    }
}