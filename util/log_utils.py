#! _*_ coding:utf8 _*_

import os
import logging
import logging.handlers
import datetime

from conf_utils import (
    get_log_conf
)

class Log(object):
    log_conf = get_log_conf()
    log_path = log_conf['log_path']
    log_level = log_conf['log_level']
    
    log_file_path = "%saccess-%s.log" % (log_path, datetime.datetime.now().strftime("%y%m%d"))

    @classmethod
    def getLog(cls, filename, filemode='a', isPrint=False):
        if os.path.exists(cls.log_file_path):
            print ("read log path success [%s]" % cls.log_file_path)
        else:
            try:
                if os.path.exists(cls.log_path) is False:
                    os.makedirs(cls.log_path)
                open(cls.log_file_path, "w+").write(
                    "create log file [%s]\n" % datetime.datetime.now())
            except Exception:
                print ("create log file error [%s]" % cls.log_file_path)
            else:
                print ("create log file success [%s]" % cls.log_file_path)
        return Log(filename, filemode, isPrint)

    def __init__(self, filename, filemode, isPrint):
        level = logging.DEBUG
        if self.log_level.lower() == "info":
            level = logging.INFO
        elif self.log_level.lower() == "debug":
            level = logging.DEBUG
        elif self.log_level.lower() == "warn":
            level = logging.WARNING
        elif self.log_level.lower() == "error":
            level = logging.ERROR
        else:
            raise Exception("log level error %s" % self.log_level)

        if filemode not in ["w", "w+", "a"]:
            raise Exception("log write type error %s" % filemode)

        if isPrint not in (True, False):
            raise Exception("is print param error %s" % isPrint)

        filename = os.path.basename(filename)
        log_format = '[%(asctime)s '+filename+' %(levelname)s]: %(message)s'
        logging.basicConfig(
            level=level,
            format=log_format,
            datefmt='%H:%M:%S',
            filename=self.log_file_path,
            filemode=filemode)

        if isPrint:
            console = logging.StreamHandler()
            console.setLevel(level)
            console.setFormatter(logging.Formatter(log_format))
            logging.getLogger().addHandler(console)

        self.log = logging

    def debug(self, message):
        self.log.debug(message)

    def info(self, message):
        self.log.info(message)

    def warn(self, message):
        self.log.warning(message)

    def error(self, message):
        self.log.error(message)


if __name__ == '__main__':
    log = Log.getLog(__file__, isPrint=True)
    log.error("hello error log [%s]" % datetime.datetime.now())
    log.info("hello info log [%s]" % datetime.datetime.now())
