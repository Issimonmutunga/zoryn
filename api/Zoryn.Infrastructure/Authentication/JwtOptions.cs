namespace Zoryn.Infrastructure.Authentication;

public sealed class JwtOptions
{
    public const string SectionName = "Jwt";

    // HMAC-SHA256 requires a key of at least 256 bits.
    public const int MinimumKeyBytes = 32;

    public string Issuer { get; set; } = "Zoryn";

    public string Audience { get; set; } = "Zoryn";

    public string Key { get; set; } = string.Empty;

    public int ExpiryMinutes { get; set; } = 60;
}
