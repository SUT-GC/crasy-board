#! -*- coding:utf8 -*-

import sys
import psutil
import json

def get_totle_vm_info():
    virtual_memory_info = psutil.virtual_memory()
    
    return {'vm_totle': virtual_memory_info.total, 'vm_available': virtual_memory_info.available, 'vm_precent': virtual_memory_info.percent, 'vm_used': virtual_memory_info.used}

if __name__ == "__main__":
    vm_info = get_totle_vm_info()
    print vm_info, vm_info['vm_used'], vm_info['vm_totle']
    print vm_info['vm_used'] / vm_info['vm_totle']
