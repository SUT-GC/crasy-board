#! -*- coding:utf8 -*-

import sys
import psutil
import json

reload(sys)
sys.setdefaultencoding("utf-8")
sys.path.append("..")

from util.size_utils import (
    get_human_size
)


def get_totle_disk_info():
    sdiskusage = psutil.disk_usage('/')
    disk_info = {'disk_totle': sdiskusage.total, 'disk_used': sdiskusage.used, 'disk_free': sdiskusage.free, 'disk_percent': sdiskusage.percent}

    return disk_info    

def get_path_disk_info(path='/'):
    diskusage = psutil.disk_usage(path)
    disk_info = {'disk_totle': _get_human_size(diskusage.total), 'disk_used': _get_human_size(diskusage.used), 'disk_free': _get_human_size(diskusage.free), 'disk_percent': diskusage.percent}

    return disk_info    

def get_disk_partitions():
    diskparts = psutil.disk_partitions(all=False)

    return [{'device': diskpart.device, 'mountpoint': diskpart.mountpoint, 'fstype': diskpart.fstype, 'opts': diskpart.opts} for diskpart in diskparts]

def get_all_disk_io():
    sdiskios = psutil.disk_io_counters(perdisk=True, nowrap=True)

    return [{'name': disk_name, 'read_count': _get_human_size(sdiskio.read_count), 'write_count': _get_human_size(sdiskio.write_count), 'read_bytes': _get_human_size(sdiskio.read_bytes), 'write_bytes': _get_human_size(sdiskio.write_bytes)} for disk_name, sdiskio in sdiskios.items() if disk_name ]

def get_disk_io():
    sdiskio = psutil.disk_io_counters(perdisk=False, nowrap=True)

    return {'read_count': _get_human_size(sdiskio.read_count), 'write_count': _get_human_size(sdiskio.write_count), 'read_bytes': _get_human_size(sdiskio.read_bytes), 'write_bytes': _get_human_size(sdiskio.write_bytes)}


def get_disk_info():
    diskusage = get_path_disk_info('/')
    all_disk_io = get_all_disk_io()
    summ_disk_io = get_disk_io()
    disk_partitions = get_disk_partitions()

    return {
        'disk_use': diskusage,
        'disk_io_all': all_disk_io,
        'disk_io': summ_disk_io,
        'disk_part': disk_partitions
    }


def _get_human_size(size):
    return get_human_size(size, 'G', 2)

if __name__ == "__main__":
    # print get_totle_disk_info()
    # print get_path_disk_info('/')
    # print get_disk_partitions()
    # print get_all_disk_io()
    # print get_disk_io()
    print get_disk_info()