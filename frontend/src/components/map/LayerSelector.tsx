type Layer = {
  name: string;
  enabled: boolean;
};

type LayerSelectorProps = {
  layers: Layer[];
};

export default function LayerSelector({
  layers,
}: LayerSelectorProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
        Layers
      </h2>

      <div className="mt-6 space-y-3">
        {layers.map((layer) => (
          <label
            key={layer.name}
            className="flex items-center justify-between"
          >
            <span className="text-sm">
              {layer.name}
            </span>

            <input
              type="checkbox"
              defaultChecked={layer.enabled}
            />
          </label>
        ))}
      </div>
    </section>
  );
}