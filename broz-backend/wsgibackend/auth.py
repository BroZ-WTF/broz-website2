import os, json
from flask import Blueprint, current_app, request, jsonify, g
from flask_cors import CORS
from flask_httpauth import HTTPBasicAuth
from werkzeug.security import check_password_hash, generate_password_hash

from itsdangerous import (TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired)

auth = HTTPBasicAuth()

auth_component = Blueprint('auth_component', __name__)
CORS(auth_component)


@auth_component.route('/token', methods=['GET'])
@auth.login_required
def get_auth_token():
  token = generate_auth_token(request.authorization['username'])
  return jsonify({'token': token.decode('ascii')})


@auth_component.route('/check', methods=['GET'])
@auth.login_required
def get_token_valid():
  pass
  return jsonify({'check': 'success'}), 200


@auth.verify_password
def verify_password(username_or_token, password):
  # first try to authenticate by token
  user = verify_auth_token(username_or_token)
  users_file = os.path.join(current_app.instance_path, current_app.config['USERS_PATH'])
  try:
    with open(users_file) as json_users:
      users = json.load(json_users)
  except IOError:
    print('Count not read file, access denied')
    return False  # can't read user-file
  if not user:
    # try to authenticate with username/password
    if not username_or_token in users['passwords']:
      return False  # username unknown
    if not check_password_hash(users['passwords'].get(username_or_token), password):
      return False  # password invalid
    else:
      g.user = username_or_token
  else:
    g.user = user
  g.rights = users['rights'].get(g.user)
  return True  # user authorized


def generate_auth_token(user_name, expiration=(24 * 60 * 60)):
  s = Serializer(current_app.config['SECRET_KEY'], expires_in=expiration)
  return s.dumps({'name': user_name})


def verify_auth_token(token):
  s = Serializer(current_app.config['SECRET_KEY'])
  try:
    data = s.loads(token)
  except SignatureExpired:
    return None  # valid token, but expired
  except BadSignature:
    return None  # invalid token
  user = data['name']
  return user