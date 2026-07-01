from zoryn.knowledge.comparator import SignatureComparator
from zoryn.knowledge.signature import Signature


def test_numeric_comparison():

    previous = Signature(
        timestamp="2024-01",
        h3_id="abc",
        variables={
            "precipitation_amount": 100.0,
        },
    )

    current = Signature(
        timestamp="2024-02",
        h3_id="abc",
        variables={
            "precipitation_amount": 125.0,
        },
    )

    comparator = SignatureComparator()

    relationship = comparator.compare(
        previous,
        current,
    )

    assert relationship.has_change(
        "precipitation_amount"
    )

    result = relationship.change(
        "precipitation_amount"
    )

    assert result.changed
    assert result.value == 25.0
    assert result.metadata["previous"] == 100.0
    assert result.metadata["current"] == 125.0
    assert result.metadata["delta"] == 25.0