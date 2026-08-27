using Zoryn.Application.DTOs;
using Zoryn.Application.Interfaces;

namespace Zoryn.Application.Services;

public sealed class EnvironmentService : IEnvironmentService
{
    public Task<EnvironmentStatusDto> GetStatusAsync()
    {
        var result = new EnvironmentStatusDto(
            "Environmental service operational.");

        return Task.FromResult(result);
    }
}