#! -*- coding:utf8 -*-
import ConfigParser

from code_utils import (
    get_md5_value
)

config_file_path = "static/config/sys_conf.conf"

config = ConfigParser.RawConfigParser()
config.read(config_file_path)

def get_log_conf():
    log_path = config.get('log', 'log_path')
    log_level = config.get('log', 'log_level')

    if log_path is None:
        raise Exception('not found log_path in config file')
    
    if log_level not in ['DEBUG', 'ERROR', 'WRAN', 'INFO']:
        raise Exception('log level must in ["DEBUG", "ERROR", "WRAN", "INFO"]')
    
    return {'log_path': log_path, 'log_level': log_level}

def get_app_conf():
    secret_key = config.get('app', 'app_scri')

    if not secret_key:
        raise Exception('secret_key must be set')
    
    return {'secret_key': secret_key}

def get_user_conf():
    user_name = config.get('user', 'user_name')
    user_pass = config.get('user', 'user_pass')
    pass_tran = config.get('user', 'pass_tran')

    print user_name, user_pass, pass_tran

    if not user_name:
        user_name == 'admin'
    
    if not user_pass:
        user_pass == 'admin'
        pass_tran = False
    
    if not pass_tran:
        pass_tran = False
    
    if pass_tran == 'False':
        user_pass = get_md5_value(user_pass)
        pass_tran = 'True'

    config.set('user', 'user_pass', user_pass)    
    config.set('user', 'pass_tran', pass_tran)

    with open(config_file_path, 'w') as fw:
        print '开始写入文件', fw
        config.write(fw)
        fw.flush()

    return {'user_name': user_name, 'user_pass': user_pass}
    

if __name__ == "__main__":
    print get_user_conf()

