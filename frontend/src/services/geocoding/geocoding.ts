export interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

const NOMINATIM_URL =
  "https://nominatim.openstreetmap.org/search";

export async function searchLocation(
  query: string,
): Promise<GeocodingResult | null> {

  const search =
    query.trim();

  if (search.length === 0) {
    return null;
  }

  const url = new URL(
    NOMINATIM_URL,
  );

  url.searchParams.set(
    "q",
    `${search}, Nairobi, Kenya`,
  );

  url.searchParams.set(
    "format",
    "jsonv2",
  );

  url.searchParams.set(
    "limit",
    "1",
  );

  const response =
    await fetch(
      url.toString(),
      {
        headers: {
          Accept:
            "application/json",

          //
          // Required by the
          // Nominatim usage policy.
          //
          "User-Agent":
            "Zoryn Environmental Reasoning Engine",
        },
      },
    );

  if (!response.ok) {
    throw new Error(
      `Location search failed (${response.status}).`,
    );
  }

  const results =
    (await response.json()) as NominatimResult[];

  if (results.length === 0) {
    return null;
  }

  const match =
    results[0];

  return {
    name:
      match.display_name,

    latitude: Number(
      match.lat,
    ),

    longitude: Number(
      match.lon,
    ),
  };
}