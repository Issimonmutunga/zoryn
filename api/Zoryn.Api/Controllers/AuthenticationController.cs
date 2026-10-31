using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Zoryn.Application.Authentication;
using Zoryn.Application.Interfaces;

namespace Zoryn.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthenticationController : ControllerBase
{
    private readonly IAuthenticationService _authenticationService;

    public AuthenticationController(IAuthenticationService authenticationService)
    {
        _authenticationService = authenticationService;
    }

    [HttpPost("register")]
    [ProducesResponseType<AuthenticationResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AuthenticationResponse>> Register(RegisterRequest request)
    {
        var result = await _authenticationService.RegisterAsync(request);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
                ModelState.AddModelError(string.Empty, error);

            return ValidationProblem(ModelState);
        }

        return CreatedAtAction(nameof(GetCurrentUser), null, result.Response);
    }

    [HttpPost("login")]
    [ProducesResponseType<AuthenticationResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthenticationResponse>> Login(LoginRequest request)
    {
        var response = await _authenticationService.LoginAsync(request);

        if (response is null)
            return Problem(
                title: "Invalid email or password.",
                statusCode: StatusCodes.Status401Unauthorized);

        return Ok(response);
    }

    [Authorize]
    [HttpGet("me")]
    [ProducesResponseType<CurrentUserDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<CurrentUserDto>> GetCurrentUser()
    {
        if (!Guid.TryParse(User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value, out var userId))
            return Unauthorized();

        // The token may outlive the account it was issued for.
        var user = await _authenticationService.GetCurrentUserAsync(userId);

        return user is null ? Unauthorized() : Ok(user);
    }
}
