"""Tests for reading DEBUG / ALLOWED_HOSTS from the environment.

Run with:  .venv/bin/python manage.py test backend
"""

import os
from unittest import TestCase
from unittest.mock import patch

from backend.env import env_bool, env_list

DEFAULT_HOSTS = ["app.safarigen.io", "localhost"]


class EnvBoolTests(TestCase):

    def check(self, value, default, expected):
        env = {} if value is None else {"X_TEST": value}
        with patch.dict(os.environ, env, clear=False):
            if value is None:
                os.environ.pop("X_TEST", None)
            self.assertIs(env_bool("X_TEST", default), expected, repr(value))

    def test_unset_or_empty_uses_default(self):
        for value in (None, "", "   "):
            self.check(value, False, False)
            self.check(value, True, True)

    def test_true_values(self):
        for value in ("1", "true", "True", "TRUE", "yes", "on", " true "):
            self.check(value, False, True)

    def test_false_values(self):
        for value in ("0", "false", "False", "no", "off"):
            self.check(value, True, False)

    def test_typos_are_not_treated_as_on(self):
        for value in ("ture", "enabled", "y"):
            self.check(value, False, False)


class EnvListTests(TestCase):

    def get(self, value):
        with patch.dict(os.environ, {"X_HOSTS": value}):
            return env_list("X_HOSTS", DEFAULT_HOSTS)

    def test_unset_uses_default(self):
        os.environ.pop("X_HOSTS", None)
        self.assertEqual(env_list("X_HOSTS", DEFAULT_HOSTS), DEFAULT_HOSTS)

    def test_empty_uses_default(self):
        self.assertEqual(self.get(""), DEFAULT_HOSTS)
        self.assertEqual(self.get(" , ,"), DEFAULT_HOSTS)

    def test_comma_separated_with_spaces(self):
        self.assertEqual(self.get("app.safarigen.io, localhost ,127.0.0.1"),
                         ["app.safarigen.io", "localhost", "127.0.0.1"])

    def test_default_list_is_not_shared(self):
        os.environ.pop("X_HOSTS", None)
        env_list("X_HOSTS", DEFAULT_HOSTS).append("evil.example")
        self.assertEqual(DEFAULT_HOSTS, ["app.safarigen.io", "localhost"])
