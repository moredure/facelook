import imghdr
import numpy as np
import cv2
from StringIO import StringIO

HAARCASCADE_PATH = "haarcascade_frontalface_default.xml"

class ImageService:
    @staticmethod
    def b64decode(uri, whitelist=['png', 'jpeg']):
        """Return decoded from base64 image binary data"""
        b64str,  = reversed(uri.split(','))
        img_stream = StringIO(b64str.decode('base64', 'strict'))
        ext = imghdr.what(img_stream)
        if ext is None or ext not in whitelist:
            raise ValueError('Unsupported mime-type')
        return img_stream

    @staticmethod
    def tocvimage(stream):
        arr = np.asarray(bytearray(stream.read()), dtype=np.uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        return img

    @staticmethod
    def detectfaces(img):
        detector = cv2.CascadeClassifier(HAARCASCADE_PATH)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = detector.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5,
                minSize=(30, 30), flags=cv2.cv.CV_HAAR_SCALE_IMAGE)
        return faces
        
