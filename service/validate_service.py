#! -*- coding:utf8 -*-

import sys

reload(sys)
sys.setdefaultencoding("utf-8")
sys.path.append("..")

from util.conf_utils import (
    get_user_conf
)

from util.code_utils import (
    get_md5_value
)

def validate_user(user_name, user_pass):
    user_info = get_user_conf()

    conf_user_name = user_info['user_name']
    conf_user_pass = user_info['user_pass']

    md5_user_pass = get_md5_value(user_pass)

    if user_name == conf_user_name and md5_user_pass == conf_user_pass:
        return True
    else:
        return False

    
if __name__ == "__main__":
    print validate_user('gc', 'gc')