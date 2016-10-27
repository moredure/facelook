import cv2
import imghdr
from numpy import asarray, uint8
from flask import Flask, request, send_from_directory
from flask_cors import cross_origin
from flask_jsontools import jsonapi
from config import CASCADE_PATH, WHITELIST, MAX_CONTENT_LENGTH

application = Flask(__name__)
application.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

@application.route('/api/detect', methods=['POST'])
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
    try:
        file = request.files['file']
    except:
        return dict(error='File is too big!'), 413
    if imghdr.what(file) not in WHITELIST:
        return dict(error='Unsupported extension!'), 415
    arr = asarray(bytearray(file.read()), dtype=uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    detector = cv2.CascadeClassifier(CASCADE_PATH)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = detector.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=6,
            minSize=(30, 30), flags=cv2.cv.CV_HAAR_SCALE_IMAGE)
    return faces.tolist() if len(faces) else []

@application.route('/')
def index():
    """Return home page"""
    return send_from_directory('templates', 'index.html')

@application.route('/cache.js')
def sw():
    """Return js service worker"""
    return send_from_directory('sw', 'cache.js')

@application.errorhandler(404)
def page_not_found(e):
    return "Not found!", 404
