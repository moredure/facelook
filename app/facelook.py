import os
import cv2
import imghdr
import urllib
from numpy import asarray, uint8
from flask import Flask, render_template, json, request

app = Flask(__name__)

if os.environ['DEBUG'] == '1':
    app.config['TEMPLATES_AUTO_RELOAD'] = True

HAARCASCADE_PATH='/usr/share/opencv/haarcascades/haarcascade_frontalface_default.xml'

@app.route('/')
def index():
    """Return rendered index page template"""
    return render_template('index.html')

@app.route('/detect', methods=['POST'])
def detect():
    """Face detection.
    Detect face on the photo and 
    return json with the result of presence/abcense of face analyze
    """
    resp = dict(result=False, error='')
    whitelist=['png', 'jpeg']
    try:
        img = urllib.urlopen(request.form['data']).read()
        ext = imghdr.what(None, img)
        if ext is None or ext not in whitelist:
            raise ValueError('Unsupported mime-type')
        arr = asarray(bytearray(img), dtype=uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        detector = cv2.CascadeClassifier(HAARCASCADE_PATH)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = detector.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5,
                minSize=(30, 30), flags=cv2.cv.CV_HAAR_SCALE_IMAGE)
        if len(faces):
            resp.update(result=True)
    except ValueError, err:
        resp.update(error=str(err.message))
        app.logger.error(str(err.message))
    except TypeError:
        resp.update(error='File is broken!')
        app.logger.error('File is broken!')
    return json.dumps(resp)

@app.errorhandler(404)
def not_found(err):
    "Handle control if page user looking for does not exists"
    return render_template('404.html'), 404
