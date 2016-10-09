import os
import sys
import unittest
from app import app
from flask import jsonify, json

class FaceDetectTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    def detect_face_test(self):
        resp = self.app.post('/detect')
        assert resp.data == json.dumps({'result':True})


