import ast
import unittest
from app import application
from detect import detect

class DetectFaceTestCaseWithFaces(unittest.TestCase):
    def setUp(self):
        self.app = application.test_client()

    def test_detect_1face(self):
        """Uses jpg image that has one face to test response of detect method from facelook

        """
        rv = detect(self, '1face.jpg')
        rv_as_list = ast.literal_eval(rv.data)
        self.assertEqual(len(rv_as_list), 1)

    def test_detect_png(self):
        """Uses png image that has one face to test response of detect method from facelook

        """
        rv = detect(self, '1.png')
        rv_as_list = ast.literal_eval(rv.data)
        self.assertEqual(len(rv_as_list), 1)

    def test_detect_6faces(self):
        """Uses image that has 6 faces to test response of detect method from facelook

        """
        rv = detect(self, '6faces.jpg')
        rv_as_list = ast.literal_eval(rv.data)
        self.assertEqual(len(rv_as_list), 6)

    def test_detect_greyscale(self):
        """Uses grayscale image with one face to test response of detect method from facelook

        """
        rv = detect(self, 'grayscale1.jpg')
        rv_as_list = ast.literal_eval(rv.data)
        self.assertEqual(len(rv_as_list), 1)
