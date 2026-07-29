import polars as pl
import psutil
import os

process = psutil.Process(os.getpid())

def mem():
    print(process.memory_info().rss / 1024 / 1024)

mem()

df = (
    pl.scan_parquet("data/processed/knowledge/pattern_evidence/*.parquet")
    .filter(pl.col("pattern_id") == "<A_REAL_PATTERN_ID>")
    .collect()
)

mem()

print(df.height)