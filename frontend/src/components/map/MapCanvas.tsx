import { useEffect, useRef } from "react";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { useExplorerStore } from "@/stores/explorerStore";

export default function MapCanvas() {
  const containerRef =
    useRef<HTMLDivElement | null>(null);

  const mapRef =
    useRef<maplibregl.Map | null>(null);

  const setSelectedH3 =
    useExplorerStore(
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
        try {
          const response =
            await fetch(
              "http://127.0.0.1:8000/map/discoveries",
            );

          if (!response.ok) {
            throw new Error(
              `HTTP ${response.status}`,
            );
          }

          const geojson =
            await response.json();

          console.log(
            "Response:",
            response.status,
          );

          console.log(
            "URL:",
            response.url,
          );

          console.log(
            "GeoJSON:",
            geojson.type,
          );

          console.log(
            "Features:",
            geojson.features.length,
          );

          map.addSource(
            "discoveries",
            {
              type: "geojson",
              data: geojson,
            },
          );

          console.log(
            "Source:",
            map.getSource(
              "discoveries",
            ),
          );

          map.addLayer({
            id: "discoveries-fill",

            type: "fill",

            source: "discoveries",

            paint: {
              "fill-color":
                "#ff0000",

              "fill-opacity": 1,
            },
          });

          map.addLayer({
            id: "discoveries-outline",

            type: "line",

            source: "discoveries",

            paint: {
              "line-color":
                "#000000",

              "line-width": 1,
            },
          });

          const bounds =
            new maplibregl.LngLatBounds();

          for (const feature of geojson.features) {
            const ring =
              feature.geometry.coordinates[0];

            for (const coordinate of ring) {
              bounds.extend(
                coordinate as [
                  number,
                  number,
                ],
              );
            }
          }

          map.fitBounds(
            bounds,
            {
              padding: 40,
            },
          );

          map.on(
            "click",
            "discoveries-fill",
            (
              event,
            ) => {
              const feature =
                event.features?.[0];

              if (!feature) {
                return;
              }

              const h3 =
                feature.properties
                  ?.h3_id;

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
        } catch (error) {
          console.error(
            "Failed to load discoveries:",
            error,
          );
        }
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