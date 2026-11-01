using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Zoryn.Application.DTOs;
using Zoryn.Application.Interfaces;
using Zoryn.Domain.Entities;

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

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<MonitoringRegionDto>> Create(
        [FromBody] string name)
    {
        if (!IsValidName(name))
            return ValidationProblem(ModelState);

        var region = await _service.CreateAsync(name);

        return CreatedAtAction(
            nameof(GetById),
            new { id = region.Id },
            region);
    }

    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] string name)
    {
        if (!IsValidName(name))
            return ValidationProblem(ModelState);

        var updated = await _service.UpdateAsync(id, name);

        return updated ? NoContent() : NotFound();
    }

    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _service.DeleteAsync(id);

        return deleted ? NoContent() : NotFound();
    }

    // Checked here so bad input is a 400, not an exception from the domain.
    private bool IsValidName(string? name)
    {
        if (string.IsNullOrWhiteSpace(name))
            ModelState.AddModelError(nameof(name), "Region name is required.");
        else if (name.Trim().Length > MonitoringRegion.MaxNameLength)
            ModelState.AddModelError(
                nameof(name),
                $"Region name cannot exceed {MonitoringRegion.MaxNameLength} characters.");

        return ModelState.IsValid;
    }
}