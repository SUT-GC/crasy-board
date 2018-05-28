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

def get_totle_vm_info():
    virtual_memory_info = psutil.virtual_memory()
    
    return {'vm_totle': virtual_memory_info.total, 'vm_available': virtual_memory_info.available, 'vm_precent': virtual_memory_info.percent, 'vm_used': virtual_memory_info.used}

def get_mem_info():
    svmem = psutil.virtual_memory()
    sswap = psutil.swap_memory()

    vmem_info = {'total': _get_gb_mem(svmem.total), 'avalible': _get_gb_mem(svmem.available), 'percent': svmem.percent, 'used': _get_gb_mem(svmem.used), 'free': _get_gb_mem(svmem.free), 'active': _get_gb_mem(svmem.active), 'inactive': _get_gb_mem(svmem.inactive), 'wired': _get_gb_mem(svmem.wired)}
    swap_info = {'total': _get_gb_mem(sswap.total), 'used': _get_gb_mem(sswap.used), 'free': _get_gb_mem(sswap.free), 'percent': sswap.percent, 'sin': _get_gb_mem(sswap.sin), 'sout': _get_gb_mem(sswap.sout)}

    return {'vmem': vmem_info, 'swap': swap_info}


def _get_gb_mem(mem_size):
    return get_human_size(mem_size, 'G', 2)


def _get_mb_mem(mem_size):
    return get_human_size(mem_size, 'M', 2)


if __name__ == "__main__":
    # vm_info = get_totle_vm_info()
    # print vm_info, vm_info['vm_used'], vm_info['vm_totle']
    # print vm_info['vm_used'] / vm_info['vm_totle']
    print psutil.virtual_memory()
    print psutil.swap_memory()
    print get_mem_info()
