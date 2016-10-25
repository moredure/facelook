import unittest
from app import application
from detect import detect, detect_folder

class DetectFaceTestCaseImproperImage(unittest.TestCase):
    def setUp(self):
        self.app = application.test_client()

    def test_detect_file_too_big(self):
        """Uses image that is bigger than acceptable size (1mb) to test response of detect method from facelook

        """
        rv = detect(self,'2mb.jpg')
        self.assertEqual(rv.status_code, 413)

    def test_detect_wrong_content_type(self):
        """Uses image that is sent with wrong content type to test response of detect method from facelook

        """
        rv = detect(self, '0faces.jpg', 'text/xml')
        self.assertEqual(rv.status_code, 413)

    def test_detect_unsupported_format(self):
        """Uses image format that is unsupported by the service to test response of detect method from facelook

        """
        rv = detect(self, '1.gif')
        self.assertEqual(rv.status_code, 415)
