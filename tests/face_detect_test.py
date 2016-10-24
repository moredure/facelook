import os
import ast
import sys
import unittest
from StringIO import StringIO
from app import application
from flask import jsonify, json
import tempfile #check if needed
from contextlib import contextmanager
from flask import appcontext_pushed




class DetectFaceTestCase(unittest.TestCase):
    def setUp(self):
        self.app = application.test_client()

    def detect (self,file):
        script_dir = os.path.dirname(__file__)
        rel_path = "testimages/"
        abs_file_path = os.path.join(script_dir, rel_path,file)
        with open(abs_file_path) as test:
            imgStringIO = StringIO(test.read())
        return self.app.post('/api/detect', content_type='multipart/form-data', data=dict(
            {'file': (imgStringIO, '1.bmp')}
            ))

    def detect_folder(self, folder):  # Lengthy test through the database
        num = 0.0
        total_num = 0.0
        script_dir = os.path.dirname(__file__)
        rel_path = "testimages/"
        abs_file_path = os.path.join(script_dir, rel_path, folder)
        for fn in os.listdir(abs_file_path):
            # if os.path.isfile(fn):
            # print (fn)
            fn_with_path = abs_file_path + '/' + fn
            rv = self.detect(fn_with_path)
            rv_as_list = ast.literal_eval(rv.data)
            total_num += 1
            face_num = len(rv_as_list)
            if face_num != 1:
                print('Found ' + str(face_num) + ' faces on the image: ' + fn)
                num += 1
        # print(num)
        # print(total_num)
        percent = int((1 - num / total_num) * 100)
        print (str(percent) + "% of the faces detected properly")
        if num > 0:
            assert False

    # def test_detect_unsupported(self):
    #     rv = self.detect('1.bmp')
    #     self.assertEqual(rv.data, '{\n  "error": "Unsupported extension!"\n}')

    def test_detect_no_faces(self):
        rv = self.detect('0faces.jpg')
        self.assertEqual(rv.data, '[]')



    def test_detect_1face(self):
        rv = self.detect('1face.jpg')
        rv_as_list = ast.literal_eval(rv.data) #converting string to list
        self.assertEqual(len(rv_as_list), 1) #comparing list size to the amount of faces

    def test_detect_greyscale(self):
        rv = self.detect('grayscale1.jpg')
        rv_as_list = ast.literal_eval(rv.data)
        self.assertEqual(len(rv_as_list), 1)

    def test_detect_png(self):
        rv = self.detect('1.png')
        rv_as_list = ast.literal_eval(rv.data)
        self.assertEqual(len(rv_as_list), 1)

    def test_detect_toobig(self):
        rv = self.detect('2mb.jpg')
        self.assertEqual(rv.status_code, 413)

    def test_detect_unsupported(self):
        rv = self.detect('1.gif')
        self.assertEqual(rv.status_code, 415)
        # assert False

    def test_detect_6faces(self):
        rv = self.detect('6faces.jpg')
        rv_as_list = ast.literal_eval(rv.data)
        self.assertEqual(len(rv_as_list), 6)

    # def test_detect_DB1(self):
    #     rv = self.detect_folder('DBUtrechtECVP')



















        # class ExtendedTestCase(unittest.TestCase):
        #
        #   def assertRaisesWithMessage(self, msg, func):
        #     try:
        #       func()
        #       self.assertFail()
        #     except Exception as inst:
        #       self.assertEqual(inst.message, msg)



        # rv_as_list = ast.literal_eval(rv.data)
        # self.assertEqual(len(rv_as_list), 6)


        # self.assertEqual(json.dumps(rv.data), '[]')
            # self.assertRaises('Unsupported extension!', self,)
        # self.assertRaises(TypeError, app.detect,  )

        # with self.assertRaises('Unsupported extension!'): #TypeError
        #     self.app[:1]

        # self.assertRaisesWithMessage('Unsupported extension!',self.detect)

        # with self.assertRaises(TypeError) as cm:
        #     failure.fail()
        # self.assertEqual(
        #     'The registeraddress must be an integer. Given: 1.0',
        #     str(cm.exception)
        # )


        # print(rv.data)
        # self.assertRaisesRegexp(self.detect(), 'wwww!')



        # self.assertRaises('Unsupported extension!', self.detect)


        # self.assertRaisesWithMessage(SomeCoolException,
        #                              'expected message',
        #                              rv)
        # self.assertRaisesWithMessage(['Unsupported extension!'], rv)
        # self.assertIsNone(rv)

        # with self.assertRaisesRegexp(ValueError, 'literal'):
        #      int('XYZ')

        # assert False


