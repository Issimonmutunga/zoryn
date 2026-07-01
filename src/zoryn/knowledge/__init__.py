"""
Knowledge subsystem.
"""

from .builder import SignatureBuilder
from .signature import Signature

__all__ = [
    "Signature",
    "SignatureBuilder",
]