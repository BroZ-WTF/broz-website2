import os

from flask import Flask
from flask_cors import CORS

cors = CORS()


def create_app(test_config=None):
  # create and configure the app
  app = Flask(__name__, instance_relative_config=True)

  cors.init_app(app, resources={r"*": {"origins": "*"}})

  app.config.from_mapping(SECRET_KEY='dev',)

  if test_config is None:
    # load the instance config, if it exists, when not testing
    app.config.from_pyfile('config.py')
  else:
    # load the test config if passed in
    app.config.from_mapping(test_config)

  # ensure the instance folder exists
  try:
    os.makedirs(app.instance_path)
  except OSError:
    pass

  from flaskr.quotes import quotes_component
  from flaskr.gallery import gallery_component

  # register components
  app.register_blueprint(quotes_component, url_prefix='/api')
  app.register_blueprint(gallery_component, url_prefix='/api')

  return app
