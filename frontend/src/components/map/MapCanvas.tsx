import { useEffect, useRef } from "react";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { useExplorerStore } from "@/stores/explorerStore";

export default function MapCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const mapRef = useRef<maplibregl.Map | null>(
    null,
  );

  const setSelectedH3 = useExplorerStore(
    (state) => state.setSelectedH3,
  );

  useEffect(() => {
    if (
      mapRef.current ||
      !containerRef.current
    ) {
      return;
    }

    const map = new maplibregl.Map({
      container: containerRef.current,

      style:
        "https://demotiles.maplibre.org/style.json",

      center: [
        36.8219,
        -1.2921,
      ],

      zoom: 10,
    });

    map.addControl(
      new maplibregl.NavigationControl(),
      "top-left",
    );

    map.on(
      "load",
      async () => {
        const response =
          await fetch(
            "/map/discoveries",
          );

        const geojson =
          await response.json();

        map.addSource(
          "discoveries",
          {
            type: "geojson",
            data: geojson,
          },
        );

        map.addLayer({
          id: "discoveries-fill",

          type: "fill",

          source: "discoveries",

          paint: {
            "fill-color": [
              "interpolate",
              ["linear"],
              [
                "get",
                "confidence",
              ],
              0,
              "#fef3c7",
              0.5,
              "#f59e0b",
              1,
              "#b45309",
            ],

            "fill-opacity": 0.7,
          },
        });

        map.addLayer({
          id: "discoveries-outline",

          type: "line",

          source: "discoveries",

          paint: {
            "line-color":
              "#92400e",

            "line-width": 0.5,
          },
        });

        map.on(
          "click",
          "discoveries-fill",
          (event) => {
            const feature =
              event.features?.[0];

            if (!feature) {
              return;
            }

            const h3 =
              feature.properties?.h3_id;

            if (
              typeof h3 ===
              "string"
            ) {
              setSelectedH3(
                h3,
              );
            }
          },
        );

        map.on(
          "mouseenter",
          "discoveries-fill",
          () => {
            map.getCanvas().style.cursor =
              "pointer";
          },
        );

        map.on(
          "mouseleave",
          "discoveries-fill",
          () => {
            map.getCanvas().style.cursor =
              "";
          },
        );
      },
    );

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [
    setSelectedH3,
  ]);

  return (
    <section className="h-full w-full">
      <div
        ref={containerRef}
        className="h-full w-full"
      />
    </section>
  );
}