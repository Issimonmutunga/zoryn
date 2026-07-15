from zoryn.explanation.factory import create_provider
from zoryn.explanation.models import PromptPackage

provider = create_provider()

prompt = PromptPackage(
    system_prompt="You are a scientific assistant.",
    user_prompt="""
Explain in one short paragraph what the
Standardized Precipitation Index (SPI) measures.
""".strip(),
    references=[],
)

response = provider.generate(
    prompt,
)

print()
print("Provider :", response.provider)
print("Model    :", response.model)
print("Latency  :", f"{response.latency_ms:.0f} ms")
print("Tokens   :", response.total_tokens)
print()
print(response.explanation)