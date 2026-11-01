namespace Zoryn.Application.Authentication;

/// <summary>
/// A registration failure tied to the request field it concerns, or to no
/// field when <see cref="Field"/> is empty.
/// </summary>
public sealed record RegistrationError(string Field, string Message);
