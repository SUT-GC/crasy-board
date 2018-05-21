#! -*- coding:utf8 -*-

import sys
import psutil
import json

reload(sys)
sys.setdefaultencoding("utf-8")
sys.path.append("..")

def get_totle_cpu_times():
    cpu_times_info = psutil.cpu_times()
    return {'user_time': cpu_times_info[0], 'system_time': cpu_times_info[1], 'idle_time': cpu_times_info[2]}


if __name__ == "__main__":
    print get_totle_cpu_times()