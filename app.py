import json
from flask import Flask, render_template, request
from flask_socketio import SocketIO
from random import random
from threading import Lock
from datetime import datetime
from dht22_module import DHT22Module
from gmc320s_module import GMC320SModule
from ltr390_module import LTR390Module
from mq135_module import MQ135Module
import board
import datetime
import random
import csv

dht22_module = DHT22Module(1) # temperature and humidity
ltr390_module = LTR390Module(2) # uv, lux
gmc320s_module = GMC320SModule(3) # radiation
mq135_module = MQ135Module(4) # aqi

sensor_modules = [dht22_module, ltr390_module, gmc320s_module, mq135_module]
# https://learn.adafruit.com/raspberry-pi-iot-dashboard-with-azure-and-circuitpython

thread = None
thread_lock = Lock()

app = Flask(__name__)
app.config["SECRET_KEY"] = "alphatheta!"
socketio = SocketIO(app, cors_allowed_origins="*")

"""
Background Thread
"""
def background_thread():
    filename = "data.csv"
    csv = open(filename, 'w')
    csv.write('date,temperature,humidity,uv,lux,cpm,aqi,apl\n')
    csv.close

    while True:
        for sensor in sensor_modules:
            # Scan through all DHT sensor connected to our raspberry pi
            temperature, humidity = dht22_module.get_sensor_readings() or (None, None)
            #print(temperature, humidity)
            uv, lux = ltr390_module.get_sensor_readings() or (None, None)
            #print(uv, lux)
            cpm, uSv = gmc320s_module.get_sensor_readings() or (None, None)
            #print(cpm)
            aqi, apl = mq135_module.get_sensor_readings() or (None, None)
            #print(aqi, apl)

            now = datetime.datetime.now()
            data = str(now.time()) + "," + str(temperature) + "," + str(humidity) + "," + str(uv) + "," + str(lux) + "," + str(cpm) + "," + str(aqi) + "," + str(apl)
            print(data)
            csv = open(filename, 'a')
            try:
                csv.write(data+'\n')
            finally:
                csv.close()

            sensor_readings = {
                "id": sensor.get_id(),
                "temperature": temperature,
                "humidity": humidity,
                "uv": uv,
                "lux": lux,
                "cpm": cpm,
                "uSv": uSv,
                "aqi": aqi,
                "apl": apl
            }
            socketio.emit("updateSensorData", json.dumps(sensor_readings))
            socketio.sleep(1)

"""
Serve root index file
"""

@app.route("/")
def index():
    return render_template("index.html", sensor_modules=sensor_modules)

"""
Decorator for connect
"""

@socketio.on("connect")
def connect():
    global thread
    print("Client connected")

    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(background_thread)


"""
Decorator for disconnect
"""


@socketio.on("disconnect")
def disconnect():
    print("Client disconnected", request.sid)


# if __name__ == "__main__":
#     socketio.run(app, port=5000, host="0.0.0.0", debug=True)
