#! -*- coding:utf8 -*-

import json

from flask import (
    Blueprint,
    render_template, 
    abort,
    request,
    session,
    Flask
)

from util.result_utils import (
    ResultUtils
)

app = Flask(__name__)

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
    

@app.route('/check/', methods=['POST'])
def check_session():
    print session

    data = request.data
    data = json.loads(data) if data else {}

    user_name = data.get('username', None)

    if user_name in session and session[user_name] == user_name:
        return ResultUtils.get_result(200, '认证成功')

    return ResultUtils.get_result(403, '认证失败，请进行登陆')


@app.route('/logout/', methods=['POST'])
def logout():
    data = request.data
    data = json.loads(data) if data else {}

    user_name = data.get('username', None)

    session.pop(user_name, None)
    print session

    return ResultUtils.get_result(200, '推出成功')

if __name__ == "__main__":
    app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
    app.run(debug=True)