import os
import unittest
from app import application
from tests.detect import detect_folder

class DetectFaceTestCaseImageLibrary(unittest.TestCase):
    def setUp(self):
        self.app = application.test_client()

    def test_detect_DB(self):
        """Test face detection on a DBUtrechtECVP database
        Database provided by University of Stirling
        Link: http://pics.psych.stir.ac.uk/2D_face_sets.htm

        Note:
        Database consists of 131 photos with one face on each photo.

        Attributes:
            folder(str): location of the folder with images relative to benchmarks folder.
        """

        folder = 'test_images/DBUtrechtECVP'
        abs_file_path = os.path.join(os.path.dirname(__file__), folder)
        rv = detect_folder(self, abs_file_path)
        assert rv
        