import os
import sys
import unittest
import app

class RoutesTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.app.test_client()

    def index_route_test(self):
        resp = self.app.get('/')
        assert resp.status_code == 200

    def detect_route_test(self):
        resp = self.app.post('/detect')
        assert resp.status_code == 200

