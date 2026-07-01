from zoryn.knowledge import Signature


def test_signature_get():

    signature = Signature(
        timestamp="2024-01",
        h3_id="abc",
        variables={
            "precipitation_amount": 100.0,
        },
    )

    assert signature.get("precipitation_amount") == 100.0
    assert signature.get("ndvi") is None


def test_signature_contains():

    signature = Signature(
        timestamp="2024-01",
        h3_id="abc",
        variables={
            "ndvi": 0.72,
        },
    )

    assert "ndvi" in signature
    assert "temperature" not in signature


def test_signature_length():

    signature = Signature(
        timestamp="2024-01",
        h3_id="abc",
        variables={
            "a": 1.0,
            "b": 2.0,
        },
    )

    assert len(signature) == 2