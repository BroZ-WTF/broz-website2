import json, os
from flask import Blueprint, current_app, jsonify, request, send_from_directory
from flask_cors import CORS

gallery_component = Blueprint('gallery_component', __name__)
CORS(gallery_component)


# GET gallery metadata
@gallery_component.route('/gallery/metadata')
def get_gallery_metadata():
  gallery_metadata_file = os.path.join(current_app.instance_path, current_app.config["DATA_PIC_METADATA_PATH"])
  try:
    with open(gallery_metadata_file) as json_metadata:
      metadata = json.load(json_metadata)
      return jsonify(metadata)
  except IOError:
    print('Count not read file, not doing anything')
    return 500


# DELETE gallery metadata
@gallery_component.route('/gallery/metadata/<int:picture_id>', methods=['DELETE'])
def del_gallery_metadata(picture_id):
  gallery_metadata_file = os.path.join(current_app.instance_path, current_app.config["DATA_PIC_METADATA_PATH"])
  try:
    with open(gallery_metadata_file, 'rt') as json_metadata:
      metadata = json.load(json_metadata)
  except IOError:
    print('Could not read file, not doing anything')
    return 500
  try:
    del metadata['pictures'][picture_id]
    with open(gallery_metadata_file, 'wt') as json_metadata:
      json.dump(metadata, json_metadata)
      return jsonify(metadata), 200
  except IndexError:
    print('Given id is not present, not doing anything')
    return 416


# POST gallery metadata
@gallery_component.route('/gallery/metadata', methods=['POST'])
def add_gallery_metadata():
  gallery_metadata_file = os.path.join(current_app.instance_path, current_app.config["DATA_PIC_METADATA_PATH"])
  posted_picture_metadata = request.get_json()
  try:
    with open(gallery_metadata_file, 'rt') as json_metadata:
      metadata = json.load(json_metadata)
  except IOError:
    print('Could not read file, starting from scratch')
    metadata = {'id': 'broz-gallery-metadata', 'pictures': []}

  if not posted_picture_metadata.keys() == {'name', 'description', 'file'}:
    # raise value error if any key is not set
    raise ValueError
  else:
    metadata['pictures'].append(posted_picture_metadata)
    with open(gallery_metadata_file, 'wt') as json_metadata:
      json.dump(metadata, json_metadata)
      return jsonify(metadata), 201


# PUT gallery metadata
@gallery_component.route('/gallery/metadata', methods=['PUT'])
def edit_gallery_metadata():
  gallery_metadata_file = os.path.join(current_app.instance_path, current_app.config["DATA_PIC_METADATA_PATH"])
  posted_picture_metadata = request.get_json()
  try:
    with open(gallery_metadata_file, 'rt') as json_metadata:
      metadata = json.load(json_metadata)
  except IOError:
    print('Could not read file, not doing anything')
    return 500
  if not posted_picture_metadata.keys() == {'id', 'name', 'description', 'file'}:
    # raise value error if any key is not set
    raise ValueError
  else:
    id = posted_picture_metadata['id']
    del posted_picture_metadata['id']
    try:
      metadata['pictures'][id] = posted_picture_metadata
      with open(gallery_metadata_file, 'wt') as json_metadata:
        json.dump(metadata, json_metadata)
        return jsonify(metadata), 201
    except IndexError:
      print('Given id is not present, not doing anything')
      return jsonify(quotes), 416


# GET picture
@gallery_component.route('/gallery/picture/<path:filename>')
def get_picture(filename):
  picture_path = os.path.join(current_app.instance_path, current_app.config["DATA_GALLERY_PATH"])
  return send_from_directory(picture_path, filename)