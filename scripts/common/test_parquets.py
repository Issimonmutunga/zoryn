from pathlib import Path
import polars as pl

df = pl.read_parquet(
    Path("data/processed/h3/pilot_nairobi_h3_res10.parquet")
)

print(df.columns)
print(df.head())