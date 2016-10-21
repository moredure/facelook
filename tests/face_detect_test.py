import os
import sys
import unittest
import StringIO
from app import  app
from flask import jsonify, json
import tempfile #check if needed
from contextlib import contextmanager
from flask import appcontext_pushed

class DetectFaceTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    def test_test(self):
        pass

    def detect (self):
        with open('tests/testimages/1.jpg') as test:
            imgStringIO = StringIO(test.read())
        return self.app.post('/detect', content_type='multipart/form-data', data=dict(
            {'file': (imgStringIO, '1.jpg')}
            ))

    def test_detect(self):
        rv = self.detect()
        assert dict(error='Unsupported extension!') in rv.data

#Doesn't work, needs a fix