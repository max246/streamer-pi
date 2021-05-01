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

@app.route('/api/list_device', methods=['GET'])
@auth.login_required
def liist_device():
    try:
        devices = manager.list_devices()
        return jsonify({"status" : True, "devices": devices})
    except Exception as e:
        print(e)
        return jsonify({"status" : False})

@app.route('/api/list_audio', methods=['GET'])
@auth.login_required
def list_audio():
    try:
        audio = manager.list_audio()
        return jsonify({"status" : True, "audio": audio})
    except Exception as e:
        print(e)
        return jsonify({"status" : False})

@app.route('/api/settings', methods=['GET'])
@auth.login_required
def settings():
    try:
        settings = manager.get_settings()
        return jsonify({"status" : True, "settings": settings})
    except Exception as e:
        print(e)
        return jsonify({"status" : False})

@app.route('/api/update_settings', methods=['POST'])
@auth.login_required
def update_settings():
    data = request.get_json()
    try:
        manager.set_settings(data)
        return jsonify({"status" : True})
    except Exception as e:
        print(e)
        return jsonify({"status" : False})

@app.route('/api/login_instagram', methods=['POST'])
@auth.login_required
def login_instagram():
    data = request.get_json()
    try:
        if manager.login_instagram(data['user'], data['pass']):
            return jsonify({"status" : True})
        else:
            if manager.require_two_fact():
                return jsonify({"status" : False, "two_factor": True})
            else:
                return jsonify({"status" : False})
    except Exception as e:
        print(e)
        return jsonify({"status" : False})

@app.route('/api/login_instagram_code', methods=['POST'])
@auth.login_required
def login_instagram_code():
    data = request.get_json()
    try:
        if manager.two_factor(data['code']):
            return jsonify({"status" : True})
        else:
            return jsonify({"status" : False})
    except Exception as e:
        print(e)
        return jsonify({"status" : False})

@app.route('/api/action_instagram', methods=['POST'])
@auth.login_required
def action_instagram():
    data = request.get_json()
    try:
        if data['mode'] == "create":
            status = manager.create_broadcast()
            return jsonify({"status" :status , "next": "start" })
        elif data['mode'] == "start":
            status = manager.start_broadcast()
            if status:
                streaminfo = manager.get_instagram_stream()
                return jsonify({"status" :status , "stream_server": streaminfo[0], "stream_key" : streaminfo[1] , "next": "end"})
            else:
                return jsonify({"status" :status })
        elif data['mode'] == "stop":
            status = manager.end_broadcast()
            return jsonify({"status" :status , "next": "create"})

    except Exception as e:
        print(e)
        return jsonify({"status" : False})

@app.route('/api/status_instagram', methods=['GET'])
@auth.login_required
def status_instagram():
    try:
        status_stream = manager.get_status_stream()
        status_login = manager.get_status_login()
        if status_login:
           streaminfo = manager.get_instagram_stream()
           if status_stream:
               return jsonify({"status" :status_login , "stream":  status_stream,"stream_server": streaminfo[0], "stream_key" : streaminfo[1]})
           else:
               return jsonify({"status" :status_login,"stream":  status_stream, })
        else:
           return jsonify({"status" :status_login })
    except Exception as e:
        print(e)
        return jsonify({"status" : False})






app.run(debug=False, host='0.0.0.0', port=port)
