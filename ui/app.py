from flask import Flask, request, jsonify, send_from_directory
from flask_httpauth import HTTPBasicAuth
from werkzeug.security import generate_password_hash, check_password_hash
import configparser
from lib.manager import *

app = Flask(__name__, static_folder='build', static_url_path='/')
auth = HTTPBasicAuth()


config = configparser.ConfigParser()
config.read('default.cfg')

password = config.get("http", "password")
port = config.get("http", "port")


users = {
    "admin": generate_password_hash(password)
}

manager = Manager(config,'default.cfg')


@auth.verify_password
def verify_password(username, password):
    if username in users and \
            check_password_hash(users.get(username), password):
        return username

@app.route('/')
@auth.login_required
def home():
    return app.send_static_file('index.html')

@app.errorhandler(404)
@auth.login_required
def not_found(e):
    return app.send_static_file('index.html')

@app.route('/api/providers')
@auth.login_required
def providers():
    items = manager.get_providers()
    active = manager.get_active_provider()
    return jsonify({'providers': items, 'active': active})

@app.route('/api/provider', methods=['POST'])
@auth.login_required
def provider():
    data = request.get_json()
    print(data)
    params = manager.get_provider(data['provider'])
    return jsonify({'params': params})


@app.route('/api/update', methods=['POST'])
@auth.login_required
def update():
    data = request.get_json()
    print(data)
    result = manager.update(data)
    if result:
        return jsonify({"status": True})
    else:
        return jsonify({"status": False})

@app.route('/api/activate', methods=['POST'])
@auth.login_required
def activate():
    data = request.get_json()
    result = manager.set_active_provider(data['provider'])
    if result:
        return jsonify({"status": True})
    else:
        return jsonify({"status": False})

@app.route('/api/start', methods=['POST'])
@auth.login_required
def start():
    data = request.get_json()
    try:
        status = manager.start_streaming(data['provider'])
        return jsonify({"status" : status})
    except Exception as e:
        print(e)
        return jsonify({"status" : False})

@app.route('/api/stop', methods=['POST'])
@auth.login_required
def stop():
    data = request.get_json()
    try:
        status = manager.stop_streaming()
        return jsonify({"status" : status})
    except Exception as e:
        print(e)
        return jsonify({"status" : False})

app.run(debug=False, host='0.0.0.0', port=port)