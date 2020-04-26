import json, os
from flask import Blueprint, current_app, jsonify, request, send_from_directory, g
from flask_cors import CORS
from wsgibackend.auth import auth

quotes_component = Blueprint('quotes_component', __name__)
CORS(quotes_component)


# GET quotes
@quotes_component.route('')
def get_quotes():
  quotes_file = os.path.join(current_app.instance_path, current_app.config['DATA_QUOTES_PATH'])
  try:
    with open(quotes_file) as json_quotes:
      quotes = json.load(json_quotes)
      return jsonify(quotes), 200
  except IOError:
    print('Count not read file, not doing anything')
    return 'No quotes saved', 500


# DELETE quote
@quotes_component.route('/<int:quote_id>', methods=['DELETE'])
@auth.login_required
def del_quote(quote_id):
  if g.rights >= current_app.config['RIGHTS_DELETE_MIN']:
    quotes_file = os.path.join(current_app.instance_path, current_app.config['DATA_QUOTES_PATH'])
    try:
      with open(quotes_file, 'rt') as json_quotes:
        quotes = json.load(json_quotes)
    except IOError:
      print('Could not read file, not doing anything')
      return 'No quotes saved', 500
    try:
      del quotes['quotes_list'][quote_id]
      with open(quotes_file, 'wt') as json_quotes:
        json.dump(quotes, json_quotes)
        return jsonify(quotes), 200
    except IndexError:
      print('Given id is not present, not doing anything')
      return jsonify(quotes), 416
  else:
    return 'Unauthorized', 401


# POST quote
@quotes_component.route('', methods=['POST'])
@auth.login_required
def add_quote():
  if g.rights >= current_app.config['RIGHTS_EDIT_MIN']:
    quotes_file = os.path.join(current_app.instance_path, current_app.config['DATA_QUOTES_PATH'])
    posted_quote = request.get_json()
    try:
      with open(quotes_file, 'rt') as json_quotes:
        quotes = json.load(json_quotes)
    except IOError:
      print('Could not read file, starting from scratch')
      quotes = {'id': 'broz-quotes', 'quotes_list': []}
    if not all(key in posted_quote for key in ('date', 'name', 'quote')):
      # raise value error if any key is not set
      raise ValueError
    else:
      quotes['quotes_list'].append(posted_quote)
      with open(quotes_file, 'wt') as json_quotes:
        json.dump(quotes, json_quotes)
        return jsonify(quotes), 201
  else:
    return 'Unauthorized', 401


# PUT quote
@quotes_component.route('', methods=['PUT'])
@auth.login_required
def edit_quote():
  if g.rights >= current_app.config['RIGHTS_EDIT_MIN']:
    quotes_file = os.path.join(current_app.instance_path, current_app.config['DATA_QUOTES_PATH'])
    posted_quote = request.get_json()
    try:
      with open(quotes_file, 'rt') as json_quotes:
        quotes = json.load(json_quotes)
    except IOError:
      print('Could not read file, not doing anything')
      return 'No quotes saved', 500
    if not all(key in posted_quote for key in ('id', 'date', 'name', 'quote')):
      # raise value error if any key is not set
      raise ValueError
    else:
      id = posted_quote['id']
      del posted_quote['id']
      try:
        quotes['quotes_list'][id] = posted_quote
        with open(quotes_file, 'wt') as json_quotes:
          json.dump(quotes, json_quotes)
          return jsonify(quotes), 200
      except IndexError:
        print('Given id is not present, not doing anything')
        return jsonify(quotes), 416
  else:
    return 'Unauthorized', 401