using Microsoft.AspNetCore.Mvc;
using Zoryn.Application.Interfaces;

namespace Zoryn.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class EnvironmentController : ControllerBase
{
    private readonly IEnvironmentService _environmentService;

    public EnvironmentController(IEnvironmentService environmentService)
    {
        _environmentService = environmentService;
    }

    [HttpGet("status")]
    public async Task<ActionResult<string>> GetStatus()
    {
        var status = await _environmentService.GetStatusAsync();

        return Ok(status);
    }
}