import unittest
from app import application
from detect import detect, detect_folder

class DetectFaceTestCaseImageLibrary(unittest.TestCase):
    def setUp(self):
        self.app = application.test_client()

    def test_detect_database_UtrechtECVP(self):
        """Test face detection on a DBUtrechtECVP database
        Database provided by University of Stirling
        Link: http://pics.psych.stir.ac.uk/2D_face_sets.htm

        """
        rv = detect_folder(self, 'DBUtrechtECVP')
        assert True
