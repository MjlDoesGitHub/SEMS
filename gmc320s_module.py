#!/usr/bin/python
# -*- coding: UTF-8 -*-

# Start program with 'geigerlog-simple.py'
# Stop program with CTRL-C
#
# Format of the log:
#   Year-Month-Day Hour:Minute:Second, CPM
#   2017-07-21 10:52:37, 574

import time                                     # time formatting and more
import sys                                      # system functions
import serial                                   # communication with serial port
import serial.tools.list_ports                  # allows listing of serial ports
import random

# my settings
my_port      = '/dev/ttyUSB0'                   # likely USB/Serial port on Linux
my_baudrate  = 115200                            # GMC-320S is 115200
ser = serial.Serial(my_port, my_baudrate)       # open serial port

class GMC320SModule:
    def __init__(self, id):
        self.id = id

    def get_id(self):
        return self.id
    
    def get_name(self):
        return "CPM", "uSv"

    def get_unit(self):
        return "infrared", "network_check"

    def get_sensor_readings(self):
        def getCPM(ser):                                # get CPM from device
            ser.write(b'<GETCPM>>')
            srec = ser.read(2)

            if sys.version_info[0] == 3:                # correct for Py2 vs Py3
                rec = chr(srec[0]) + chr(srec[1])
            else:
                rec = srec
            return ord(rec[0])<< 8 | ord(rec[1])

        while True:
            cpm = getCPM(ser)  
            uSv = cpm * 0.00812
            print("CPM:", cpm)
            return cpm, uSv
            # return random.randint(300,400), random.randint(300,400)