import json, os
from flask import Blueprint, current_app, jsonify, request, send_from_directory
from flask_cors import CORS

quotes_component = Blueprint('quotes_component', __name__)
CORS(quotes_component)


# GET quotes
@quotes_component.route('/quotes/')
def get_quotes():
  quotes_file = os.path.join(current_app.instance_path, current_app.config["DATA_QUOTES_PATH"])
  try:
    with open(quotes_file) as json_quotes:
      quotes = json.load(json_quotes)
      return jsonify(quotes), 200
  except IOError:
    print("Count not read file, not doing anything")
    return 500


# DELETE quote
@quotes_component.route('/quotes/<int:quote_id>', methods=['DELETE'])
def del_quote(quote_id):
  quotes_file = os.path.join(current_app.instance_path, current_app.config["DATA_QUOTES_PATH"])
  try:
    with open(quotes_file, 'rt') as json_quotes:
      quotes = json.load(json_quotes)
  except IOError:
    print('Could not read file, not doing anything')
    return 500
  try:
    del quotes['quotes_list'][quote_id]
    with open(quotes_file, 'wt') as json_quotes:
      json.dump(quotes, json_quotes)
      return jsonify(quotes), 200
  except IndexError:
    print('Given id is not present, not doing anything')
    return jsonify(quotes), 416


# POST quote
@quotes_component.route('/quotes/', methods=['POST'])
def add_quote():
  quotes_file = os.path.join(current_app.instance_path, current_app.config["DATA_QUOTES_PATH"])
  posted_quote = request.get_json()
  print('Post quote incoming:')
  print(posted_quote)
  try:
    with open(quotes_file, 'rt') as json_quotes:
      quotes = json.load(json_quotes)
  except IOError:
    print('Could not read file, starting from scratch')
    quotes = {'id': 'broz-quotes', 'quotes_list': []}

  if not posted_quote.keys() == {'name', 'quote', 'date'}:
    # raise value error if any key is not set
    raise ValueError
  else:
    quotes['quotes_list'].append(posted_quote)
    with open(quotes_file, 'wt') as json_quotes:
      json.dump(quotes, json_quotes)
      return jsonify(quotes), 201


# PUT quote
@quotes_component.route('/quotes/', methods=['PUT'])
def edit_quote():
  quotes_file = os.path.join(current_app.instance_path, current_app.config["DATA_QUOTES_PATH"])
  posted_quote = request.get_json()
  try:
    with open(quotes_file, 'rt') as json_quotes:
      quotes = json.load(json_quotes)
  except IOError:
    print('Could not read file, not doing anything')
    return 500
  if not posted_quote.keys() == {'id', 'name', 'quote', 'date'}:
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