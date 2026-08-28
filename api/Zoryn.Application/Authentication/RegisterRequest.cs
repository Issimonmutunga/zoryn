namespace Zoryn.Application.Authentication;

public sealed record RegisterRequest(
    string Email,
    string Password);