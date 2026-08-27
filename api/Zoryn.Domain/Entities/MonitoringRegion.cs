namespace Zoryn.Domain.Entities;

public sealed class MonitoringRegion
{
    public Guid Id { get; private set; }

    public string Name { get; private set; }

    public MonitoringRegion(Guid id, string name)
    {
        if (id == Guid.Empty)
            throw new ArgumentException("Region ID cannot be empty.", nameof(id));

        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Region name cannot be empty.", nameof(name));

        Id = id;
        Name = name;
    }
}