import os
import cv2
from flask import Flask, render_template, json

app = Flask(__name__)

@app.route('/')
def index():
    """Return rendered index page template"""
    return render_template('index.html', items=range(100))

@app.route('/detect', methods=['POST'])
def detect():
    """Face detection.
    Detect face on the photo and 
    return json with the result of presence/abcense of face analyze
    """
    return json.dumps(dict(result=True))

@app.errorhandler(404)
def not_found(err):
    return render_template('404.html'), 404
