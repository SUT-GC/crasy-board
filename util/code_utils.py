#! -*- cofing:utf8 -*-

import hashlib

def get_md5_value(v):
    hl = hashlib.md5()
    hl.update(v.encode(encoding='utf-8'))

    return hl.hexdigest()

if __name__ == "__main__":
    print get_md5_value('gc')