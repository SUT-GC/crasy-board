#! -*- coding:utf8 -*-

import sys
import psutil
import json
import time

reload(sys)
sys.setdefaultencoding("utf-8")
sys.path.append("..")

def get_totle_cpu_info():
    cpu_times_info = psutil.cpu_times()
    cpu_usage = psutil.cpu_percent(interval=None)

    return {'user_time': cpu_times_info.user, 'system_time': cpu_times_info.system, 'idle_time': cpu_times_info.idle, 'cpu_usage': cpu_usage}

if __name__ == "__main__":
    print get_totle_cpu_info()
