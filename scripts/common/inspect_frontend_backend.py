from __future__ import annotations

from pathlib import Path

import pandas as pd


ROOT = Path(__file__).resolve().parents[2]

OUTPUT = ROOT / "inspection_report.txt"


FILES = [
    "src/zoryn/rest/repository.py",
    "src/zoryn/rest/routes.py",
    "src/zoryn/rest/schemas.py",
]

DATASETS = [
    "data/processed/h3/pilot_nairobi_h3_res10.parquet",
    "data/processed/discoveries/discoveries_part_000001.parquet",
    "data/processed/knowledge/discoveries/part_000001.parquet",
]


def divider(title: str) -> str:
    return (
        "\n"
        + "=" * 80
        + "\n"
        + title
        + "\n"
        + "=" * 80
        + "\n"
    )


report = []


report.append(divider("PROJECT ROOT"))
report.append(str(ROOT))


#
# Python source inspection
#

for relative in FILES:

    path = ROOT / relative

    report.append(divider(relative))

    if not path.exists():

        report.append("FILE NOT FOUND\n")
        continue

    report.append(path.read_text(encoding="utf8"))


#
# Dataset inspection
#

for relative in DATASETS:

    path = ROOT / relative

    report.append(divider(relative))

    if not path.exists():

        report.append("DATASET NOT FOUND\n")
        continue

    df = pd.read_parquet(path)

    report.append(f"Rows: {len(df)}")
    report.append(f"Columns: {len(df.columns)}")
    report.append("")

    report.append("Column Names")

    for c in df.columns:
        report.append(f"  - {c}")

    report.append("")
    report.append("Dtypes")

    report.append(str(df.dtypes))

    report.append("")
    report.append("First 5 Rows")

    report.append(str(df.head()))

    report.append("")
    report.append("Null Counts")

    report.append(str(df.isna().sum()))

    report.append("")
    report.append("Describe")

    try:
        report.append(str(df.describe(include="all")))
    except Exception:
        pass


OUTPUT.write_text(
    "\n".join(map(str, report)),
    encoding="utf8",
)

print()
print("Inspection complete.")
print(OUTPUT)