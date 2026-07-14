"""
Quick validation for the spatial API.
"""

from __future__ import annotations

import json

import requests


BASE_URL = "http://127.0.0.1:8000"


response = requests.get(
    f"{BASE_URL}/map/discoveries",
    timeout=120,
)

response.raise_for_status()

payload = response.json()

assert payload["type"] == "FeatureCollection"

features = payload["features"]

assert len(features) > 0

print("=" * 80)
print("GeoJSON VALID")
print("=" * 80)
print()

print(f"Features : {len(features)}")

first = features[0]

print()
print("Geometry Type")
print(first["geometry"]["type"])

print()
print("Properties")

print(
    json.dumps(
        first["properties"],
        indent=2,
    )
)

print()
print("First Feature")

print(
    json.dumps(
        first,
        indent=2,
    )[:3000]
)