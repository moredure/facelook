import os
import cv2
from services import ImageService
from flask import Flask, render_template, json, request

app = Flask(__name__)

if os.environ['DEBUG'] == '1':
    app.config['TEMPLATES_AUTO_RELOAD'] = True

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
    try:
        img_stream = ImageService.b64decode(request.data)
        img = ImageService.tocvimage(img_stream)
        faces = ImageService.detectfaces(img)
    except ValueError, err:
        resp['error'] = str(err.message)
        app.logger.error(str(err.message))
    except TypeError:
        resp['error'] = 'File is broken!'
        app.logger.error('File is broken!')
    if faces and len(faces) > 0:
        resp['result'] = True
    return json.dumps(resp)

@app.errorhandler(404)
def not_found(err):
    "Handle control if page user looking for does not exists"
    return render_template('404.html'), 404
