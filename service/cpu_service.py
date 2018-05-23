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

def get_cpu_info():
    all_cpu_percent = psutil.cpu_percent(percpu=True)
    total_cpu_percent = psutil.cpu_percent(percpu=False, interval=1)
    all_cpu_times = psutil.cpu_times(percpu=True)
    total_cpu_times = psutil.cpu_times(percpu=False)
    all_cpu_freq = psutil.cpu_freq(percpu=True)
    total_cpu_freq = psutil.cpu_freq(percpu=False)

    return {
        'eve_cpu_times': all_cpu_times, 'eve_cpu_persent': all_cpu_percent, 'eve_cpu_freq': all_cpu_freq,
        'total_cpu_times': total_cpu_times, 'total_cpu_persent': total_cpu_percent, 'total_cpu_freq': {'current': total_cpu_freq.current, 'min': total_cpu_freq.min, 'max': total_cpu_freq.max}
    }

if __name__ == "__main__":
    # print get_totle_cpu_info()
    print get_cpu_info()
