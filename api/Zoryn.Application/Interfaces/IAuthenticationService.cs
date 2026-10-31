using Zoryn.Application.Authentication;

namespace Zoryn.Application.Interfaces;

public interface IAuthenticationService
{
    Task<RegistrationResult> RegisterAsync(RegisterRequest request);

    /// <summary>
    /// Returns null when the credentials are invalid or the account is locked out.
    /// </summary>
    Task<AuthenticationResponse?> LoginAsync(LoginRequest request);

    Task<CurrentUserDto?> GetCurrentUserAsync(Guid userId);
}
