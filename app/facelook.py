import os
import cv2
from services import ImageService
from flask import Flask, render_template, json, request

app = Flask(__name__)

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
    resp = {
        'result': False,
        'error': ''
    }

    try:
        img_stream = ImageService.b64decode(request.data)
    except ValueError, err:
        resp['error'] = str(err.message)
        app.logger.error(str(err.message))
        return json.dumps(resp)
    except TypeError:
        resp['error'] = 'Broken file!'
        app.logger.error('Broken file!')
        return json.dumps(resp)
        
    img = ImageService.tocvimage(img_stream)
    detector = cv2cv2.CascadeClassifier("haarcascade_frontalface_default.xml")
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = detector.detectMultiScale(img, scaleFactor=1.1, minNeighbors=5,
            minSize=(30, 30), flags=cv2.cv.CV_HAAR_SCALE_IMAGE)

    if len(faces) > 0:
        resp['result'] = True

    return json.dumps(resp)

@app.errorhandler(404)
def not_found(err):
    "Handle control if page user looking for does not exists"
    return render_template('404.html'), 404
