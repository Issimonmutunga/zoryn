namespace Zoryn.Application.Authentication;

public sealed record RegistrationResult
{
    public AuthenticationResponse? Response { get; private init; }

    public IReadOnlyList<string> Errors { get; private init; } = [];

    public bool Succeeded => Response is not null;

    public static RegistrationResult Success(AuthenticationResponse response) =>
        new() { Response = response };

    public static RegistrationResult Failure(IEnumerable<string> errors) =>
        new() { Errors = errors.ToList() };
}
