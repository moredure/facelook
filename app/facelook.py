import cv2
import imghdr
from os import path, environ
from numpy import asarray, uint8
from flask import Flask, request
from flask_cors import cross_origin
from flask_jsontools import jsonapi

ROOT_PATH = path.dirname(__file__)
CASCADE_PATH = path.abspath(ROOT_PATH) + '/haarcascade_frontalface_default.xml'
WHITELIST = ['png', 'jpeg', 'gif']

application = Flask(__name__)

@application.route('/detect', methods=['POST'])
@cross_origin()
@jsonapi
def detect():
    """Face detection.
    Detect face on the photo and 
    return json with the result of presence/abcense of face analyze
    Request format:
    Content-Type: multipart-encoded file
    Response format:
    Content-Type: application/json
    list{list{x1, y1, width, height}}
    """
    file = request.files['file']
    if imghdr.what(file) not in WHITELIST:
        return dict(error='Unsupported extension!'), 415
    arr = asarray(bytearray(file.read()), dtype=uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    detector = cv2.CascadeClassifier(CASCADE_PATH)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = detector.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=6,
            minSize=(30, 30), flags=cv2.cv.CV_HAAR_SCALE_IMAGE)
    return faces.tolist() if len(faces) else []
