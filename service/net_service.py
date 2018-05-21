#! -*- coding:utf8 -*-

import sys
import psutil
import json

def get_total_net_info():
    snetio = psutil.net_io_counters(nowrap=False)

    return {'bytes_sent': snetio.bytes_sent, 'bytes_recv': snetio.bytes_recv, 'packets_sent': snetio.packets_sent, 'packets_recv': snetio.packets_recv}

if __name__ == "__main__":
    print get_total_net_info()