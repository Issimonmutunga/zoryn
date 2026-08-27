using Zoryn.Application.DTOs;

namespace Zoryn.Application.Interfaces;

public interface IEnvironmentService
{
    Task<EnvironmentStatusDto> GetStatusAsync();
}