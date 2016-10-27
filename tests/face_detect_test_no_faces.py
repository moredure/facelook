import unittest
from app import application
from detect import detect

class DetectFaceTestCaseNoFaces(unittest.TestCase):
    def setUp(self):
        self.app = application.test_client()

    def test_detect_no_faces(self):
        """Uses image that has no faces to test response of detect method from facelook

        """
        rv = detect(self, '0faces.jpg')
        self.assertEqual(rv.data, '[]')
