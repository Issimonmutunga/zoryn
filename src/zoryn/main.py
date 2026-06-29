"""
Zoryn entry point.
"""

from __future__ import annotations

from zoryn import Zoryn


def main() -> int:
    """
    Start the Zoryn application.
    """
    app = Zoryn()

    print("Zoryn")
    print("Continually Learning Early Warning System")
    print(f"Events: {len(app.events)}")
    print(f"Hypotheses: {len(app.hypotheses)}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())