""" 
Canonical identifiers used throughout Zoryn. 

Every persistent object receives a globally unique identifier. 

Identifiers never change. 

""" 
from __future__ import annotations 
from uuid import UUID, uuid4 

def new_id() -> UUID: 
    """ 
    Generate a new immutable identifier. 
    
    Returns 
    ------- 
    UUID A globally unique identifier.
      """ 
    return uuid4()