# coding=utf-8

import json, os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

# creating the Flask application
app = Flask(__name__)
# allow CORS
CORS(app)
# read config
app.config.from_pyfile('config.cfg')

quotes_file = os.path.join(app.instance_path, app.config["DATA_QUOTES_PATH"])
gallery_metadata_file = os.path.join(app.instance_path, app.config["DATA_PIC_METADATA_PATH"])
picture_path = os.path.join(app.instance_path, app.config["DATA_GALLERY_PATH"])


# GET quotes
@app.route('/quotes')
def get_quotes():
  try:
    with open(quotes_file) as json_quotes:
      quotes = json.load(json_quotes)
      return jsonify(quotes), 200
  except IOError:
    print("Count not read file, not doing anything")
    return 500


# DELETE quote
@app.route('/quotes/<int:quote_id>', methods=['DELETE'])
def del_quote(quote_id):
  try:
    with open(quotes_file, 'rt') as json_quotes:
      quotes = json.load(json_quotes)
  except IOError:
    print("Could not read file, not doing anything")
    return 500
  try:
    del quotes["quotes_list"][quote_id]
    with open(quotes_file, 'wt') as json_quotes:
      json.dump(quotes, json_quotes)
      return jsonify(quotes), 200
  except IndexError:
    print("Given id is not present, not doing anything")
    return jsonify(quotes), 416


# POST quote
@app.route('/quotes', methods=['POST'])
def add_quote():
  posted_quote = request.get_json()
  try:
    with open(quotes_file, 'rt') as json_quotes:
      quotes = json.load(json_quotes)
  except IOError:
    print("Could not read file, starting from scratch")
    quotes = {"id": "broz-quotes", "quotes_list": []}

  if not posted_quote.keys() == {'name', 'quote', 'date'}:
    # raise value error if any key is not set
    raise ValueError
  else:
    quotes["quotes_list"].append(posted_quote)
    with open(quotes_file, 'wt') as json_quotes:
      json.dump(quotes, json_quotes)
      return jsonify(quotes), 201


# PUT quote
@app.route('/quotes', methods=['PUT'])
def edit_quote():
  posted_quote = request.get_json()
  try:
    with open(quotes_file, 'rt') as json_quotes:
      quotes = json.load(json_quotes)
  except IOError:
    print("Could not read file, not doing anything")
    return 500
  if not posted_quote.keys() == {'id', 'name', 'quote', 'date'}:
    # raise value error if any key is not set
    raise ValueError
  else:
    id = posted_quote["id"]
    del posted_quote["id"]
    try:
      quotes["quotes_list"][id] = posted_quote
      with open(quotes_file, 'wt') as json_quotes:
        json.dump(quotes, json_quotes)
        return jsonify(quotes), 200
    except IndexError:
      print("Given id is not present, not doing anything")
      return jsonify(quotes), 416


# GET gallery metadata
@app.route('/gallery/metadata')
def get_gallery_metadata():
  try:
    with open(gallery_metadata_file) as json_metadata:
      metadata = json.load(json_metadata)
      return jsonify(metadata)
  except IOError:
    print("Count not read file, not doing anything")
    return 500


# DELETE gallery metadata
@app.route('/gallery/metadata/<int:picture_id>', methods=['DELETE'])
def del_gallery_metadata(picture_id):
  try:
    with open(gallery_metadata_file, 'rt') as json_metadata:
      metadata = json.load(json_metadata)
  except IOError:
    print("Could not read file, not doing anything")
    return 500
  try:
    del metadata["pictures"][picture_id]
    with open(gallery_metadata_file, 'wt') as json_metadata:
      json.dump(metadata, json_metadata)
      return jsonify(metadata), 200
  except IndexError:
    print("Given id is not present, not doing anything")
    return 416


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

  if not posted_picture_metadata.keys() == {'name', 'description', 'file'}:
    # raise value error if any key is not set
    raise ValueError
  else:
    metadata["pictures"].append(posted_picture_metadata)
    with open(gallery_metadata_file, 'wt') as json_metadata:
      json.dump(metadata, json_metadata)
      return jsonify(metadata), 201


# PUT gallery metadata
@app.route('/gallery/metadata', methods=['PUT'])
def edit_gallery_metadata():
  posted_picture_metadata = request.get_json()
  try:
    with open(gallery_metadata_file, 'rt') as json_metadata:
      metadata = json.load(json_metadata)
  except IOError:
    print("Could not read file, not doing anything")
    return 500
  if not posted_picture_metadata.keys() == {'id', 'name', 'description', 'file'}:
    # raise value error if any key is not set
    raise ValueError
  else:
    id = posted_picture_metadata["id"]
    del posted_picture_metadata["id"]
    try:
      metadata["pictures"][id] = posted_picture_metadata
      with open(gallery_metadata_file, 'wt') as json_metadata:
        json.dump(metadata, json_metadata)
        return jsonify(metadata), 201
    except IndexError:
      print("Given id is not present, not doing anything")
      return jsonify(quotes), 416


# GET picture
@app.route('/gallery/picture/<path:filename>')
def get_picture(filename):
  return send_from_directory(picture_path, filename)