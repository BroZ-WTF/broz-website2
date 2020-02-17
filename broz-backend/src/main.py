# coding=utf-8

from flask import Flask, jsonify, request
from flask_cors import CORS

# creating the Flask application
app = Flask(__name__)
CORS(app)


@app.route('/test')
def get_test():
    test = {'thomas': 90, 'robin': 100}
    return jsonify(test)
