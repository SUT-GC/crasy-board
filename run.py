#! -*- coding:utf8 -*-

import json

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

    print user_name, pass_word
    
    session[user_name] = user_name
    print session

    return ResultUtils.get_result(200, user_name)
    

@app.route('/logout/', methods=['POST'])
def logout():
    data = request.data
    data = json.loads(data) if data else {}

    user_name = data.get('username', None)

    session.pop(user_name, None)
    log.info('after logout session is :%s' % session)

    return ResultUtils.get_result(200, '退出成功')

if __name__ == "__main__":
    app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
    app.run(debug=True)