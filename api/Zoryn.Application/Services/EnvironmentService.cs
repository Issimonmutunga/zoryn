namespace Zoryn.Application.Services;

using Zoryn.Application.Interfaces;

public sealed class EnvironmentService : IEnvironmentService
{
    public Task<string> GetStatusAsync()
    {
        return Task.FromResult("Environmental service operational.");
    }
}