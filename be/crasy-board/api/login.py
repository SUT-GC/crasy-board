#! -*- coding:utf8 -*-

from flask import (
    Blueprint,
    render_template, 
    abort,
    request,
)

from util.result_utils import (
    ResultUtils
)

import json

login_page = Blueprint('login_page', __name__)

@login_page.route('/', methods=['POST', 'GET'])
def login():
    if request.method == 'GET':
        return _get_session()
    else:
        data = request.data
        data = json.loads(data) if data else {}

        user_name = data.get('username', None)
        pass_word = data.get('password', None)

        print user_name, pass_word

        return ResultUtils.get_result(200)

def _get_session():
    return ResultUtils.get_result(300)