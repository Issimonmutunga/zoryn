using System.ComponentModel.DataAnnotations;

namespace Zoryn.Application.Authentication;

public sealed record RegisterRequest(
    [Required, EmailAddress] string Email,
    [Required] string Password,
    [MaxLength(100)] string? DisplayName = null);
