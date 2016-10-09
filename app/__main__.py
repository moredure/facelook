import os
import cv2
from flask import Flask, render_template, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    """Return rendered home page template"""
    return render_template('index.html', items=range(100))

@app.route('/facelook', methods=['POST'])
def facelook():
    """Face detection.
    Detect face on the photo and 
    return json with the result of presence/abcense of face analyze
    """
    return jsonify(dict(result=True))

@app.errorhandler(404)
def not_found(err):
    return render_template('404.html'), 404

if __name__ == '__main__':
    OPTIONS = dict(debug=1,host='0.0.0.0')
    app.run(**OPTIONS)
