""" 
Canonical time utilities. 

All timestamps in Zoryn are timezone-aware UTC. 
""" 
from __future__ import annotations 
from datetime import UTC, datetime 

def now() -> datetime: 
    """ Return the current UTC timestamp. """ 
    return datetime.now(UTC)