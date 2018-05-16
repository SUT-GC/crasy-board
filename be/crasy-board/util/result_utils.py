#! -*- coding:utf8 -*-

import json

class ResultUtils(object):
    
    @staticmethod
    def get_result(code, data=None):
        if not data:
            return json.dumps({'code': code, 'data': ''})

if __name__ == "__main__":
    print ResultUtils.get_result(200)