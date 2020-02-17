# coding=utf-8

import json, os
from flask import Flask, jsonify, request
from flask_cors import CORS

# creating the Flask application
app = Flask(__name__)
CORS(app)

quotes_file = 'data/quotes.json'
gallery_metadata_file = 'data/gallery/metadata.json'

# debug - testing json-files
with open(quotes_file) as json_quotes:
  quotes = json.load(json_quotes)
  print(quotes["id"])
  print(type(quotes["quotes_list"]))


# GET quotes
@app.route('/quotes')
def get_quotes():
  with open(quotes_file) as json_quotes:
    quotes = json.load(json_quotes)
    return jsonify(quotes)


# POST quotes
@app.route('/quotes', methods=['POST'])
def add_quote():
  posted_quote = request.get_json()
  try:
    with open(quotes_file, 'rt') as json_quotes:
      quotes = json.load(json_quotes)
  except IOError:
    print("Could not read file, starting from scratch")
    quotes = {"id": "broz-quotes", "quotes_list": []}

  if not posted_quote.keys() >= {'name', 'quote'}:
    # raise value error if any key is not set
    raise ValueError
  else:
    quotes["quotes_list"].append(posted_quote)
    with open(quotes_file, 'wt') as json_quotes:
      json.dump(quotes, json_quotes)
      return jsonify(posted_quote), 201


# GET gallery metadata
@app.route('/gallery/metadata')
def get_gallery_metadata():
  with open(gallery_metadata_file) as json_metadata:
    metadata = json.load(json_metadata)
    return jsonify(metadata)


# POST gallery metadata
@app.route('/gallery/metadata', methods=['POST'])
def add_gallery_metadata():
  posted_picture_metadata = request.get_json()
  try:
    with open(gallery_metadata_file, 'rt') as json_metadata:
      metadata = json.load(json_metadata)
  except IOError:
    print("Could not read file, starting from scratch")
    metadata = {"id": "broz-gallery-metadata", "pictures": []}

  if not posted_picture_metadata.keys() >= {'name', 'description', 'file'}:
    # raise value error if any key is not set
    raise ValueError
  else:
    metadata["pictures"].append(posted_picture_metadata)
    with open(gallery_metadata_file, 'wt') as json_metadata:
      json.dump(metadata, json_metadata)
      return jsonify(posted_picture_metadata), 201