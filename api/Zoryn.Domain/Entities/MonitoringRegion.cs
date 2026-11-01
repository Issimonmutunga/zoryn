namespace Zoryn.Domain.Entities;

public sealed class MonitoringRegion
{
    public const int MaxNameLength = 200;

    public Guid Id { get; private set; }

    public string Name { get; private set; } = string.Empty;

    public MonitoringRegion(Guid id, string name)
    {
        if (id == Guid.Empty)
            throw new ArgumentException("Region ID cannot be empty.", nameof(id));

        Id = id;
        ChangeName(name);
    }

    public void ChangeName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Region name cannot be empty.", nameof(name));

        name = name.Trim();

        if (name.Length > MaxNameLength)
            throw new ArgumentException(
                $"Region name cannot exceed {MaxNameLength} characters.", nameof(name));

        Name = name;
    }
}