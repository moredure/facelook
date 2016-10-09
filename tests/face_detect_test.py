import os
import sys
import unittest
from app import app
from flask import jsonify, json

class DetectFaceTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    def detect_face_test(self):
        pass


