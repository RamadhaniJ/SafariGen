"""Small helpers for reading settings from environment variables."""

import os

_TRUE = {"1", "true", "yes", "on"}
_FALSE = {"0", "false", "no", "off"}


def env_bool(name, default=False):
    """Read a yes/no setting. Unset, empty or unrecognised values give `default`."""
    value = os.getenv(name, "").strip().lower()
    if value in _TRUE:
        return True
    if value in _FALSE:
        return False
    return default


def env_list(name, default):
    """Read a comma-separated list. Unset or empty gives `default`."""
    items = [item.strip() for item in os.getenv(name, "").split(",") if item.strip()]
    return items or list(default)
