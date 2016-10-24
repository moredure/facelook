import cv2
import imghdr
import os

import sys
import time

from os import path, environ
from numpy import asarray, uint8
from flask import Flask, request, \
    render_template, send_from_directory
from flask_cors import cross_origin
from flask_jsontools import jsonapi

ROOT_PATH = path.dirname(__file__)
CASCADE_PATH = path.abspath(ROOT_PATH) + \
    '/haarcascade_frontalface_default.xml'
WHITELIST = ['png', 'jpeg']

application = Flask(__name__)
application.config['MAX_CONTENT_LENGTH'] = 2 * 1024 * 1024

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
    # try:
    file = request.files['file']
    # print (type(file))
    # if type(file) is not FileStorage:
    #     return dict(error='File is too big!'), 420
    # file.seek(0, os.SEEK_END)
    # print(file.tell())
    # file.seek(0,0)
    # # if file.tell() > 1000000:
    # #     return dict(error='File is too big!'), 420
    if imghdr.what(file) not in WHITELIST:
        return dict(error='Unsupported extension!'), 415
    arr = asarray(bytearray(file.read()), dtype=uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_GRAYSCALE)
    detector = cv2.CascadeClassifier(CASCADE_PATH)
    faces = detector.detectMultiScale(img, scaleFactor=1.15, minNeighbors=6,
            minSize=(30, 30), flags=cv2.cv.CV_HAAR_SCALE_IMAGE)
    return faces.tolist() if len(faces) else []

@application.route('/')
def index():
    """Return home page"""
    return render_template('index.html')

@application.route('/cache.js')
def sw():
    """Return js servise worker"""
    return send_from_directory('sw', 'cache.js')
