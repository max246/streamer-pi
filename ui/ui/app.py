from flask import Flask, request, jsonify, send_from_directory
from flask_httpauth import HTTPBasicAuth
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename

import configparser
from utils.package_manager import *

ALLOWED_EXTENSIONS = {'mp3', 'jpg'}

app = Flask(__name__, static_folder='build', static_url_path='/')
app.config['MAX_CONTENT_LENGTH'] = 40 * 1024 * 1024
auth = HTTPBasicAuth()


config = configparser.ConfigParser()
config.read('default.cfg')

password = config.get("http", "password")
active_config = config.get("http", "active")
main_config = config.get("http", "config")
port = config.get("http", "port")

path_upload = "./upload/"
path_main = "../phone/"

users = {
    "admin": generate_password_hash(password)
}

package_manager = PackageManager(path_upload, path_main)
package_manager.update()

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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
'''
@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('js', path)
'''


@app.route('/api/packages')
@auth.login_required
def list():
    package_manager.update()
    items = package_manager.get_packages()
    return jsonify({'packages': items})

@app.route('/api/settings')
@auth.login_required
def settings():
    items= package_manager.get_main_parameters()
    return jsonify({'settings': items})

@app.route('/api/settings/set', methods=['POST'])
@auth.login_required
def settings_set():
    data = request.get_json()
    status = package_manager.set_main_parameters(data['volume'], data['keypad'], data['provider'], data['display'], data['auto_pickup'], data['api_host'], data['question_amount'])
    if status:
        return jsonify({"status": True})
    else:
        return jsonify({"status": False})

@app.route('/api/package/<index>')
@auth.login_required
def get_package(index):
    try:
        item = package_manager.get_packages()[int(index)]
        return jsonify({"status" : True,'package': item})
    except Exception as e:
        print(e)
        return jsonify({"status" : False})


@app.route('/api/package/activate', methods=['POST'])
@auth.login_required
def package_activate():
    data = request.get_json()
    if data['index'] == "local": #Set the default one
        item = ["local"]
    else: #Set one from the uploaded
        item = package_manager.get_packages()[int(data['index'])]
    if item is not None and len(item) > 0:
        status = package_manager.set_activate(item[0])
        return jsonify({"status": status})
    else:
        return jsonify({"status": False})

@app.route('/api/package/add', methods=['POST'])
@auth.login_required
def package_add():
    data = request.get_json()
    result =  package_manager.create_project(data['name'])
    if result:
        return jsonify({"status": True})
    else:
        return jsonify({"status": False})

@app.route('/api/package/edit', methods=['POST'])
@auth.login_required
def package_edit():
    data = request.get_json()
    result = package_manager.edit_project(data['index'],data['name'])
    return jsonify({"status": result})

@app.route('/api/package/del', methods=['POST'])
@auth.login_required
def package_del():
    data = request.get_json()
    result = package_manager.del_project(data['index'])
    return jsonify({"status": result})

@app.route('/api/questions/<id>', methods=['GET'])
@auth.login_required
def questions(id):
    result = package_manager.get_questions(id)
    return jsonify({ "status": True, "result": result})


@app.route('/api/question/<id>/<index>', methods=['GET'])
@auth.login_required
def question(id, index):
    result = package_manager.get_questions(id)[int(index)]
    return jsonify({ "status": True, "result": result})

@app.route('/api/question/add/<pack_id>', methods=['POST'])
@auth.login_required
def question_add(pack_id):
    section = package_manager.add_question(request.form['packageId'], request.form['name'], request.form['answer'])
    if  section is None:
        return jsonify({"status": False})

    items = [["fileCorrect", "correct"], ["fileIncorrect", "incorrect"] ,["fileNoanswer", "noanswer"], ["fileQuestion", "question"]]
    try:
        for item in items:
            if item[0] in request.files:
                file = request.files[item[0]]
                if file.filename == '':
                    return jsonify({"status": False})
                if file and allowed_file(file.filename):
                    filename = package_manager.get_question_filename_section(request.form['packageId'], section, item[1])
                    file.save(os.path.join("./", filename))
                else:
                    return jsonify({"status": False})
    except Exception as e:
        print(e)
        return jsonify({"status": False})

    return jsonify({"status": True})

    '''data = request.get_json()
    items = []
    for item in data['items']:
        items.append(item['key'], item['value'])
    result = package_manager.add_question(data['id'], items)
    return jsonify({"status": result})'''

@app.route('/api/question/del', methods=['POST'])
@auth.login_required
def question_del():
    data = request.get_json()
    result = package_manager.del_question(data['index'], data['pack_id'])
    return jsonify({"status": result})

@app.route('/api/question/edit/<pack_id>/<index>', methods=['POST'])
@auth.login_required
def question_edit(pack_id, index):
    items = [["fileCorrect", "correct"], ["fileIncorrect", "incorrect"] ,["fileNoanswer", "noanswer"], ["fileQuestion", "question"]]
    try:
        for item in items:
            if item[0] in request.files:
                file = request.files[item[0]]
                if file.filename == '':
                    return jsonify({"status": False})
                if file and allowed_file(file.filename):
                    filename = package_manager.get_question_filename(request.form['packageId'], request.form['index'], item[1])
                    file.save(os.path.join("./", filename))
                else:
                    return jsonify({"status": False})
    except Exception as e:
        print(e)
        return jsonify({"status": False})
    result = package_manager.edit_question(request.form['packageId'], request.form['index'], request.form['name'], request.form['answer'])
    return jsonify({"status": result})

@app.route('/api/extras/<id>', methods=['GET'])
@auth.login_required
def extras(id):
    result = package_manager.get_extras(id)
    return jsonify({"result": result})

@app.route('/api/extra/<id>/<index>', methods=['GET'])
@auth.login_required
def extra(id, index):
    result = package_manager.get_extras(id)[int(index)]
    return jsonify({"status": True, "result": result})

@app.route('/api/extra/edit', methods=['POST'])
@auth.login_required
def extra_edit():
    if 'file' not in request.files:
        return jsonify({"status": False})
    file = request.files['file']
    if file.filename == '':
        return jsonify({"status": False})
    if file and allowed_file(file.filename):
        filename = package_manager.get_extra_filename(request.form['packageId'], request.form['id'])
        file.save(os.path.join("./", filename))
        return jsonify({"status": True})
    return jsonify({"status": False})

@app.route('/api/intros/<id>', methods=['GET'])
@auth.login_required
def intros(id):
    result = package_manager.get_intros(id)
    return jsonify({"status": True, "result": result})

@app.route('/api/intro/<id>/<index>', methods=['GET'])
@auth.login_required
def intro(id, index):
    result = package_manager.get_intros(id)[int(index)]
    return jsonify({"status": True, "name": result})

@app.route('/api/intro/edit', methods=['POST'])
@auth.login_required
def intro_edit():
    if 'file' not in request.files:
        return jsonify({"status": False})
    file = request.files['file']
    if file.filename == '':
        return jsonify({"status": False})
    if file and allowed_file(file.filename):
        filename = package_manager.get_intro_filename(request.form['packageId'], request.form['id'])
        file.save(os.path.join("./", filename))
        return jsonify({"status": True})
    return jsonify({"status": False})




app.run(debug=False, host='0.0.0.0', port=port)
