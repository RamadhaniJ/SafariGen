EAC_COUNTRIES = [
    "democratic republic of the congo",
    "tanzania",
    "uganda",
    "south sudan",
    "somalia",
    "kenya",
    "rwanda",
    "burundi",
]

import re

_EMOJI_PATTERN = re.compile(
    "["
    "\U0001F1E0-\U0001F1FF"  # flags (iOS)
    "\U0001F300-\U0001F5FF"  # symbols & pictographs
    "\U0001F600-\U0001F64F"  # emoticons
    "\U0001F680-\U0001F6FF"  # transport & map symbols
    "\U0001F700-\U0001F77F"
    "\U0001F780-\U0001F7FF"
    "\U0001F800-\U0001F8FF"
    "\U0001F900-\U0001F9FF"
    "\U0001FA00-\U0001FA6F"
    "\U0001FA70-\U0001FAFF"
    "\u2600-\u26FF"
    "\u2700-\u27BF"
    "]+",
    flags=re.UNICODE,
)

def normalize_country(country: str) -> str:
    if not country:
        return ""
    cleaned = _EMOJI_PATTERN.sub("", country)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned.lower()


def is_eac_country(country: str) -> bool:
    normalized = normalize_country(country)
    if not normalized:
        return False
    # Substring match — handles "democratic republic of the congo" vs "congo"
    return any(eac in normalized or normalized in eac for eac in EAC_COUNTRIES)


def determine_residency(traveller, client_request) -> str:

    if getattr(traveller, "is_resident", False):
        return "RESIDENT"

    country = getattr(client_request.client_requested, "country", "") or ""
    if is_eac_country(country):
        return "EAC_MEMBER"

    return "NON_RESIDENT"


