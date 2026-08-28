namespace Zoryn.Application.Authentication;

public sealed record LoginRequest(
    string Email,
    string Password);