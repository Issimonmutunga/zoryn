using Microsoft.AspNetCore.Identity;

namespace Zoryn.Infrastructure.Identity;

public class ApplicationUser : IdentityUser<Guid>
{
    public required string DisplayName { get; set; }

    public DateTime CreatedAtUtc { get; set; }
}