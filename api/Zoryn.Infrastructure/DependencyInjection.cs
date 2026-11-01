using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Zoryn.Application.Interfaces;
using Zoryn.Infrastructure.Data;
using Zoryn.Infrastructure.Identity;
using Zoryn.Infrastructure.Repositories;
using Zoryn.Infrastructure.Authentication;
namespace Zoryn.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        string connectionString,
        IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(
                connectionString,
                npgsqlOptions => npgsqlOptions.UseNetTopologySuite()));

        services.AddIdentityCore<ApplicationUser>(options =>
            {
                options.User.RequireUniqueEmail = true;
            })
            .AddRoles<IdentityRole<Guid>>()
            .AddEntityFrameworkStores<ApplicationDbContext>();

        var jwtSection = configuration.GetSection(JwtOptions.SectionName);
        var jwtOptions = jwtSection.Get<JwtOptions>() ?? new JwtOptions();

        if (Encoding.UTF8.GetByteCount(jwtOptions.Key) < JwtOptions.MinimumKeyBytes)
            throw new InvalidOperationException(
                $"JWT signing key 'Jwt:Key' must be at least {JwtOptions.MinimumKeyBytes} bytes.");

        services.Configure<JwtOptions>(jwtSection);

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                // Keep standard JWT claim names (sub, email) instead of mapping to ClaimTypes URIs.
                options.MapInboundClaims = false;

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtOptions.Issuer,
                    ValidAudience = jwtOptions.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtOptions.Key)),
                    NameClaimType = JwtRegisteredClaimNames.Email,
                    ClockSkew = TimeSpan.FromMinutes(1)
                };
            });
        services.AddScoped<IAuthenticationService, AuthenticationService>();
        services.AddScoped<IMonitoringRegionRepository, MonitoringRegionRepository>();

        return services;
    }
}