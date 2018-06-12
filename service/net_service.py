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

def get_total_net_info():
    snetio = psutil.net_io_counters(nowrap=False)

    return {'bytes_sent': _get_mb_mem(snetio.bytes_sent), 'bytes_recv': _get_mb_mem(snetio.bytes_recv), 'packets_sent': _get_mb_mem(snetio.packets_sent), 'packets_recv': _get_mb_mem(snetio.packets_recv)}

def _get_gb_mem(mem_size):
    return get_human_size(mem_size, 'G', 2)

def _get_mb_mem(mem_size):
    return get_human_size(mem_size, 'M', 2)

if __name__ == "__main__":
    print get_total_net_info()