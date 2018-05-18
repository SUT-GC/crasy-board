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

def validate_login(func):
    def wrapper():
        log.info('validate login session:%s, cookit:%s' % (session, request.cookies))

        username = request.cookies.get('crasy-board-user')
        if username in session and session[username] == username:
            return func()
        else:
            return send_file('templates/login.html')

    return wrapper

@app.route('/', methods=['GET'])
@validate_login
def index():
    return send_file('templates/index.html')


@app.route('/login/', methods=['POST'])
def login():
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