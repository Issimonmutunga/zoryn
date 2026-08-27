namespace Zoryn.Application.Interfaces;

public interface IEnvironmentService
{
    Task<string> GetStatusAsync();
}