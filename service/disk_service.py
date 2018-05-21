#! -*- coding:utf8 -*-

import sys
import psutil
import json


def get_totle_disk_info():
    sdiskusage = psutil.disk_usage('/')
    disk_info = {'disk_totle': sdiskusage.total, 'disk_used': sdiskusage.used, 'disk_free': sdiskusage.free, 'disk_percent': sdiskusage.percent}

    return disk_info    

if __name__ == "__main__":
    print get_totle_disk_info()