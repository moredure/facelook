import base64
import imghdr
import numpy as np
import cv2
from StringIO import StringIO

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
        img = stream.read()
        img = np.asarray(bytearray(img), dtype='uint8')
        img = cv2.imdecode(img, cv2.IMREAD_COLOR)
        return img
        
