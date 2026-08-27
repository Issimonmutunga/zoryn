namespace Zoryn.Domain.Entities;

public sealed class MonitoringRegion
{
    public Guid Id { get; private set; }

    public string Name { get; private set; }

    public MonitoringRegion(Guid id, string name)
    {
        Id = id;
        Name = name;
    }
}