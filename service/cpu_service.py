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
    all_cpu_percent = psutil.cpu_percent(percpu=True, interval=1)
    total_cpu_percent = psutil.cpu_percent(percpu=False, interval=1)
    all_cpu_times = psutil.cpu_times(percpu=True)
    total_cpu_times = psutil.cpu_times(percpu=False)
    all_cpu_freq = psutil.cpu_freq(percpu=True)
    total_cpu_freq = psutil.cpu_freq(percpu=False)

    return {
        'eve_cpu_times': [{'user_times':cpu_times.user, 'system_times': cpu_times.system, 'idle_times': cpu_times.idle} for cpu_times in all_cpu_times],
        'eve_cpu_persent': [{'cpu_percent': cpu_percent} for cpu_percent in all_cpu_percent], 
        'eve_cpu_freq': [{'current': cpu_freq.current, 'min': cpu_freq.min, 'max': cpu_freq.max} for cpu_freq in all_cpu_freq],
        'total_cpu_times': {'user_times':total_cpu_times.user, 'system_times': total_cpu_times.system, 'idle_times': total_cpu_times.idle},
        'total_cpu_persent': total_cpu_percent, 
        'total_cpu_freq': {'current': total_cpu_freq.current, 'min': total_cpu_freq.min, 'max': total_cpu_freq.max}
    }

if __name__ == "__main__":
    # print get_totle_cpu_info()
    print get_cpu_info()
