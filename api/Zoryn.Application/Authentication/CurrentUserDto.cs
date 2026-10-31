namespace Zoryn.Application.Authentication;

public sealed record CurrentUserDto(
    Guid Id,
    string Email,
    string DisplayName,
    DateTime CreatedAtUtc);
