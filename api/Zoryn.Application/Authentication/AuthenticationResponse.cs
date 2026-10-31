namespace Zoryn.Application.Authentication;

public sealed record AuthenticationResponse(
    string AccessToken,
    DateTime ExpiresAtUtc,
    CurrentUserDto User);
