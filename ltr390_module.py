import adafruit_dht
import time
import board
import busio
import adafruit_ltr390
import random

i2c = busio.I2C(board.SCL, board.SDA)
ltr = adafruit_ltr390.LTR390(i2c)

# uvs - The raw UV light measurement
# light - The raw ambient light measurement
# uvi - The calculated UV Index value
# lux - The calculated Lux ambient light value

class LTR390Module:
    def __init__(self, id):
        self.id = id

    def get_id(self):
        return self.id
    
    def get_name(self):
        return "UV", "Lux"

    def get_unit(self):
        return "emoji_objects", "lightbulb"

    def get_sensor_readings(self):
        while True:
            try:
                print("UV:", ltr.uvs, "\t\tLux:", ltr.lux)
                return ltr.uvs, ltr.lux
                # return random.randint(100,200), random.randint(100,200)
            except RuntimeError as error:
                # Errors happen fairly often, DHT's are hard to read, just keep going
                print(error.args[0])
                time.sleep(2.0)
                continue
            except Exception as error:
                raise error
