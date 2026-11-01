import { useEffect, useMemo, useRef } from "react";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "@/styles/map.css";
import { useTimelineStore } from "@/stores/timelineStore";
import {
  mapApi,
  type MapFeatureCollection,
  type MapFeature,
  type SpiRecord,
} from "@/services/api/map";
import { useExplorerStore } from "@/stores/explorerStore";
import { useDiscoveryHighlights } from "@/hooks/useDiscoveries";
import { useLayerStore } from "@/stores/layerStore";

import {
  SPI_FILL_COLOR,
  SPI_FILL_OPACITY,
  spiClassOf,
} from "@/components/map/spiClasses";

// "2024-08" -> "Aug 2024"; anything else is shown as is.
function formatMonth(
  value: unknown,
): string {

  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}$/.test(value)
  ) {
    return "";
  }

  const [year, month] =
    value.split("-").map(Number);

  return new Date(year, month - 1, 1)
    .toLocaleString("en", {
      month: "short",
      year: "numeric",
    });

}

// MapTiler when a key is configured; otherwise OpenFreeMap's keyless
// Positron style, so the map never fails to load for want of a key.
const MAPTILER_API_KEY =
  import.meta.env.VITE_MAPTILER_API_KEY;

const BASEMAP_STYLE_URL =
  MAPTILER_API_KEY
    ? `https://api.maptiler.com/maps/basic-v2/style.json?key=${MAPTILER_API_KEY}`
    : "https://tiles.openfreemap.org/styles/positron";


export default function MapCanvas() {

  const containerRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const mapRef =
    useRef<maplibregl.Map | null>(
      null,
    );

  const geojsonRef =
    useRef<MapFeatureCollection | null>(
      null,
    );

  const popupRef =
    useRef(
      new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 18,
        className: "zoryn-popup",
      }),
    );

  const selectedH3 =
    useExplorerStore(
      (state) => state.selectedH3,
    );

  const setSelectedH3 =
    useExplorerStore(
      (state) => state.setSelectedH3,
    );

  const searchTarget =
    useExplorerStore(
      (state) => state.searchTarget,
    );

  const setSearchTarget =
    useExplorerStore(
      (state) => state.setSearchTarget,
    );

  const selectedDate =
    useTimelineStore(
      (state) => state.selectedDate,
    );

  const {
    data: discoveryHighlights = [],
  } = useDiscoveryHighlights();

  const visibleLayers =
    useLayerStore(
      (state) => state.visibleLayers,
    );

  const highlightedH3 = useMemo(
    () =>
      new Set(
        discoveryHighlights.map(
          (item) => item.h3_id,
        ),
      ),
    [discoveryHighlights],
  );

  // Latest values for map event handlers and effects that must not re-run
  // when these change (re-running would rebuild the map or refetch SPI).
  const highlightedH3Ref = useRef(highlightedH3);
  const selectedH3Ref = useRef(selectedH3);

  useEffect(() => {
    highlightedH3Ref.current = highlightedH3;
    selectedH3Ref.current = selectedH3;
  }, [highlightedH3, selectedH3]);

  // Set once the user has moved the map (by hand or by searching), so the
  // initial fit to the pilot area, which waits for the geometry to load,
  // doesn't undo it.
  const navigatedRef = useRef(false);

  useEffect(() => {

    const map =
      mapRef.current;

    if (
      !map ||
      !searchTarget
    ) {
      return;
    }

    navigatedRef.current = true;

    map.flyTo({
      center: [
        searchTarget.longitude,
        searchTarget.latitude,
      ],
      zoom: 16,
      duration: 1500,
      essential: true,
    });

    setSearchTarget(
      null,
    );

  }, [
    searchTarget,
    setSearchTarget,
  ]);

  useEffect(() => {

    if (
      mapRef.current ||
      !containerRef.current
    ) {
      return;
    }

    const map =
      new maplibregl.Map({

        container:
          containerRef.current,

        style: BASEMAP_STYLE_URL,

        // Collapsed to an (i) button so it doesn't cover the map on phones.
        attributionControl: {
          compact: true,
        },

        center: [
          37.073878,
          -1.294257,
        ],

        zoom: 15,

      });

    map.addControl(
      new maplibregl.NavigationControl(),
      "top-left",
    );

    // Only user gestures carry an originalEvent; programmatic moves don't.
    map.on(
      "movestart",
      (event) => {

        if (event.originalEvent) {
          navigatedRef.current = true;
        }

      },
    );

    map.on(
      "load",
      async () => {

        const DEFAULT_MONTH =
          useTimelineStore
            .getState()
            .selectedDate ??
          "2024-12";

        const geometry =
          (await mapApi.getGeometry()) as MapFeatureCollection;

        const spi =
          (await mapApi.getSpi(
            DEFAULT_MONTH,
          )) as SpiRecord[];

        const spiLookup =
          new Map(
            spi.map(
              (row: SpiRecord) => [
                row.h3_id,
                row,
              ],
            ),
          );

        const geojson = {
          ...geometry,
          features:
            geometry.features.map(
              (feature: MapFeature) => {

                const properties =
                  feature.properties as {
                    h3_id: string;
                    spi3: number | null;
                    timestamp: string | null;
                    highlight: boolean;
                  };

                const values =
                  spiLookup.get(
                    properties.h3_id,
                  );

                return {

                  ...feature,

                  properties: {

                    ...feature.properties,

                    spi3:
                      values?.spi3 ?? null,

                    timestamp:
                      values?.timestamp ?? "",

                    highlight:
                      highlightedH3Ref.current.has(
                        properties.h3_id,
                      ),

                  },

                };

              },
            ),
        };

        geojsonRef.current =
          geojson;

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
            "fill-color": SPI_FILL_COLOR,
            "fill-opacity": [
              "case",
              [
                "==",
                ["get", "h3_id"],
                "",
              ],
              0.9,
              SPI_FILL_OPACITY,
            ],
            "fill-outline-color": [
              "case",
              [
                "==",
                ["get", "h3_id"],
                "",
              ],
              "#8C7744",
              "transparent",
            ],
            "fill-color-transition": {
              duration: 250,
              delay: 0,
            },
            "fill-opacity-transition": {
              duration: 250,
              delay: 0,
            },
          },
        });

        map.addLayer({
          id: "discoveries-outline",

          type: "line",

          source: "discoveries",

          paint: {
            "line-color": "#555555",
            "line-width": 0.25,
            "line-opacity": 0.35,
          },
        });

        map.addLayer({
          id: "discoveries-highlights",

          type: "line",

          source: "discoveries",

          filter: [
            "==",
            ["get", "highlight"],
            true,
          ],

          paint: {
            "line-color": "#5B6B45",
            "line-width": 2,
            "line-opacity": 0.95,
          },
        });

        map.addLayer({
          id: "discoveries-selected",

          type: "line",

          source: "discoveries",

          paint: {
            "line-color": "#8C7744",

            "line-width": [
              "case",
              [
                "==",
                [
                  "get",
                  "h3_id",
                ],
                "",
              ],
              2,
              0,
            ],
          },
        });

        const bounds =
          new maplibregl.LngLatBounds();

        for (
          const feature
          of geojson.features
        ) {

          const coordinates =
            feature.geometry.coordinates[0];

          for (
            const coordinate
            of coordinates
          ) {

            bounds.extend(
              coordinate as [
                number,
                number,
              ],
            );

          }

        }

        if (!navigatedRef.current) {

          map.fitBounds(
            bounds,
            {
              padding: 80,
              maxZoom: 16,
            },
          );

        }

        map.on(
          "click",
          "discoveries-fill",
          (
            event,
          ) => {

            if (
              useExplorerStore.getState()
                .isReasoningLoading
            ) {
              return;
            }

            const feature =
              event.features?.[0];

            if (
              !feature
            ) {
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
          (
            event,
          ) => {

            map.getCanvas().style.cursor =
              "pointer";

            const feature =
              event.features?.[0];

            if (
              !feature
            ) {
              return;
            }

            const properties =
              feature.properties ?? {};

            const value =
              properties.spi3;

            const spiClass =
              spiClassOf(
                typeof value === "number"
                  ? value
                  : null,
              );

            const category =
              spiClass?.name ??
              "No SPI data";

            const detail =
              typeof value === "number" &&
              Number.isFinite(value)
                ? `SPI-3 ${value.toFixed(2)} · ${formatMonth(properties.timestamp)}`
                : formatMonth(properties.timestamp);

            popupRef.current
              .setLngLat(
                event.lngLat,
              )
              .setHTML(
                `
<div
  style="
    min-width:150px;
    padding:8px;
    border-radius:8px;
    background:#FAF7EF;
    border:1px solid #D8CEB8;
    font-family:'IBM Plex Sans',ui-sans-serif,system-ui,sans-serif;
    color:#2B2417;
  "
>

  <div
    style="
      font-size:13px;
      font-weight:600;
      line-height:1.15;
      margin-bottom:5px;
    "
  >
    ${category}
  </div>

  <div
    style="
      font-size:10px;
      font-weight:500;
    "
  >
    ${detail}
  </div>

</div>
`,
              )
              .addTo(
                map,
              );
          },
        );

        map.on(
          "mouseleave",
          "discoveries-fill",
          () => {

            map.getCanvas().style.cursor =
              "";

            popupRef.current.remove();

          },
        );

      },
    );

    mapRef.current =
      map;

    const popup =
      popupRef.current;

    return () => {

      popup.remove();

      map.remove();

      mapRef.current =
        null;

    };

  }, [
    setSelectedH3,
  ]);

  useEffect(() => {
    const map =
      mapRef.current;
    if (!map) {
      return;
    }
    const date =
      selectedDate ??
      "2024-12";
    const currentMap =
      map;
    let cancelled =
      false;
    async function updateMap() {

      const spi =
        (await mapApi.getSpi(
          date,
        )) as SpiRecord[];

      if (
        cancelled
      ) {
        return;
      }

      if (
        !geojsonRef.current
      ) {
        return;
      }

      const spiLookup =
        new Map(
          spi.map(
            (row: SpiRecord) => [
              row.h3_id,
              row,
            ],
          ),
        );

      geojsonRef.current.features.forEach(
        (feature: MapFeature) => {

          const properties =
            feature.properties as {
              h3_id: string;
              spi3: number | null;
              timestamp: string | null;
              highlight: boolean;
            };

          const values =
            spiLookup.get(
              properties.h3_id,
            );

          properties.spi3 =
            values?.spi3 ?? null;

          properties.timestamp =
            values?.timestamp ?? "";

          properties.highlight =
            highlightedH3.has(
              properties.h3_id,
            );

        },
      );

      const source =
        currentMap.getSource(
          "discoveries",
        );

      if (
        source &&
        source.type ===
          "geojson"
      ) {

        (
          source as
          maplibregl.GeoJSONSource
        ).setData(
          geojsonRef.current,
        );

        currentMap.triggerRepaint();

        if (
          currentMap.getLayer(
            "discoveries-highlights",
          )
        ) {

          currentMap.setFilter(
            "discoveries-highlights",
            [
              "==",
              ["get", "highlight"],
              true,
            ],
          );

        }

      }

      const selectedH3 =
        selectedH3Ref.current;

      if (
        selectedH3 &&
        !geojsonRef.current.features.some(
          (
            feature: MapFeature,
          ) => {

            const properties =
              feature.properties as {
                h3_id: string;
                spi3: number | null;
                timestamp: string | null;
              };

            return (
              properties.h3_id ===
              selectedH3
            );

          },
        )
      ) {

        setSelectedH3(
          null,
        );

      }

    }
    if (
      !map.isStyleLoaded()
    ) {

      map.once("idle", () => {
        updateMap();
      });

    } else {
      updateMap();
    }
    return () => {

      cancelled =
        true;

    };
  }, [
    selectedDate,
    highlightedH3,
    setSelectedH3,
  ]);

  useEffect(() => {

    const map =
      mapRef.current;

    if (
      !map ||
      !map.getLayer(
        "discoveries-selected",
      )
    ) {
      return;
    }

    const selectedFilter: maplibregl.ExpressionSpecification = [
      "==",
      [
        "get",
        "h3_id",
      ],
      selectedH3 ??
        "",
    ];

    map.setPaintProperty(
      "discoveries-selected",
      "line-width",
      [
        "case",
        selectedFilter,
        2,
        0,
      ],
    );

    if (
      map.getLayer(
        "discoveries-fill",
      )
    ) {

      map.setPaintProperty(
        "discoveries-fill",
        "fill-opacity",
        [
          "case",
          selectedFilter,
          0.9,
          SPI_FILL_OPACITY,
        ],
      );

      map.setPaintProperty(
        "discoveries-fill",
        "fill-outline-color",
        [
          "case",
          selectedFilter,
          "#8C7744",
          "transparent",
        ],
      );

    }

  }, [
    selectedH3,
  ]);

  useEffect(() => {

    const map =
      mapRef.current;

    if (!map) {
      return;
    }

    if (
      map.getLayer(
        "discoveries-fill",
      )
    ) {

      map.setLayoutProperty(
        "discoveries-fill",
        "visibility",
        visibleLayers.spi
          ? "visible"
          : "none",
      );

    }

    if (
      map.getLayer(
        "discoveries-outline",
      )
    ) {

      map.setLayoutProperty(
        "discoveries-outline",
        "visibility",
        visibleLayers.spi
          ? "visible"
          : "none",
      );

    }

    if (
      map.getLayer(
        "discoveries-highlights",
      )
    ) {

      map.setLayoutProperty(
        "discoveries-highlights",
        "visibility",
        visibleLayers.discoveryHighlights
          ? "visible"
          : "none",
      );

    }

  }, [
    visibleLayers,
  ]);

  return (

    <section
      className="h-full w-full"
    >

      <div
        ref={
          containerRef
        }
        className="h-full w-full"
      />

    </section>

  );

}