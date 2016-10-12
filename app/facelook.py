import cv2
from os import path, environ
from imghdr import what
from urllib import urlopen
from numpy import asarray, uint8
from flask import Flask, render_template, json, request
from flask_cors import cross_origin

app = Flask(__name__)

if environ['DEBUG'] and environ['DEBUG'] == '1':
    app.config['TEMPLATES_AUTO_RELOAD'] = True

ROOT_PATH = path.abspath(path.dirname(__file__))
HAARCASCADE_PATH = ROOT_PATH + '/res/cascades/haarcascade_frontalface_default.xml'

@app.route('/')
def index():
    """Return rendered index page template"""
    return render_template('index.html')

@app.route('/detect', methods=['POST', 'PUT'])
@cross_origin()
def detect():
    """Face detection.
    Detect face on the photo and 
    return json with the result of presence/abcense of face analyze
    """
    resp = dict(result=False, error='')
    whitelist=['png', 'jpeg']
    try:
        img = urlopen(request.form['data']).read()
        ext = what(None, img)
        if ext is None or ext not in whitelist:
            raise ValueError('Unsupported mime-type')
        arr = asarray(bytearray(img), dtype=uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        detector = cv2.CascadeClassifier(HAARCASCADE_PATH)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = detector.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=6,
                minSize=(30, 30), flags=cv2.cv.CV_HAAR_SCALE_IMAGE)
        if len(faces):
            resp.update(result=True)
    except ValueError, err:
        resp.update(error='Unsupported mime-type')
        app.logger.error(str(err.message))
        return json.dumps(resp), 415
    except TypeError:
        resp.update(error='File is broken!')
        app.logger.error('File is broken!'),
        return json.dumps(resp), 400
    return json.dumps(resp)

@app.errorhandler(404)
def not_found(err):
    "Handle control if page user looking for does not exists"
    return render_template('404.html'), 404
