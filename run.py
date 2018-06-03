#! -*- coding:utf8 -*-

import json
import sys

reload(sys)
sys.setdefaultencoding("utf-8")
sys.path.append(".")

from flask import (
    Blueprint,
    render_template, 
    abort,
    request,
    session,
    Flask,
    url_for,
    redirect,
    render_template,
    send_file
)

from util.result_utils import (
    ResultUtils
)

from util.log_utils import (
    Log
)

from util.conf_utils import (
    get_app_conf
)

from service.validate_service import (
    validate_user
)

from service.cpu_service import (
    get_totle_cpu_info,
    get_cpu_info,
)

from service.memory_service import (
    get_totle_vm_info
)

from service.disk_service import (
    get_totle_disk_info
)

from service.net_service import (
    get_total_net_info
)

from service.memory_service import (
    get_mem_info
)

app = Flask(__name__)
log = Log.getLog(__name__, isPrint=True)

def validate_login():
    log.info('validate login session:%s, cookit:%s' % (session, request.cookies))

    username = request.cookies.get('crasy-board-user')
    if username in session and session[username] == username:
        return True
    else:
        return False


@app.route('/', methods=['GET'])
def root():
    log.info('request root')
    if validate_login():
        return send_file('templates/index.html')
    else:
        return send_file('templates/login.html')

@app.route('/index/', methods=['GET'])
def index():
    log.info('request index')
    if validate_login():
        return send_file('templates/index.html')
    else:
        return send_file('templates/login.html')


@app.route('/login/', methods=['POST', 'GET'])
def login():
    if request.method == 'GET':
        return send_file('templates/login.html')

    data = request.data
    data = json.loads(data) if data else {}

    user_name = data.get('username', None)
    pass_word = data.get('password', None)

    if validate_user(user_name, pass_word):
        session[user_name] = user_name
        print session

        return ResultUtils.get_result(200, user_name)
    else:
        return ResultUtils.get_result(403, '账号或者密码不正确')
    

@app.route('/logout/', methods=['POST'])
def logout():
    data = request.data
    data = json.loads(data) if data else {}

    user_name = data.get('username', None)

    session.pop(user_name, None)
    log.info('after logout session is :%s' % session)

    return ResultUtils.get_result(200, '退出成功')


@app.route('/data/dashboard/', methods=['GET'])
def data_dashboard():
    log.info('data dashboard')
    if validate_login():
        cpu_data = get_totle_cpu_info()
        vm_data = get_totle_vm_info()
        disk_data = get_totle_disk_info()
        net_data = get_total_net_info()

        result_data = {'cpu_data': cpu_data, 'vm_data': vm_data, 'disk_data': disk_data, 'net_data': net_data}
        log.info('data dashboard result: %s' % result_data)

        return ResultUtils.get_result(200, result_data)
    else:
        
        return send_file('templates/login.html')

@app.route('/data/cpudashboard/', methods=['GET'])
def cpu_dashboard():
    log.info('cpu dashboard')
    if validate_login():
        cpu_data = get_cpu_info()

        result_data = {'cpu_data': cpu_data}
        log.info('cpu dashboard result: %s' % result_data)

        return ResultUtils.get_result(200, result_data)
    else:
        
        return send_file('templates/login.html')

@app.route('/data/memdashboard/', methods=['GET'])
def mem_dashboard():
    log.info('mem dashboard')
    if validate_login():
        mem_data = get_mem_info()

        result_data = {'mem_data': mem_data}
        log.info('mem dashboard result: %s' % result_data)

        return ResultUtils.get_result(200, result_data)
    else:
        
        return send_file('templates/login.html')


if __name__ == "__main__":
    app_conf = get_app_conf()
    app.secret_key = app_conf['secret_key']
    app.run(debug=True)