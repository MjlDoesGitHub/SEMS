import adafruit_dht
import time
import board
import busio
import adafruit_ltr390

i2c = busio.I2C(board.SCL, board.SDA)
ltr = adafruit_ltr390.LTR390(i2c)

# uvs - The raw UV light measurement
# light - The raw ambient light measurement
# uvi - The calculated UV Index value
# lux - The calculated Lux ambient light value

class LTR390Module:
    def get_sensor_readings(self):
        while True:
            try:
                print("UV:", ltr.uvs, "\t\tAmbient Light:", ltr.light)
                print("UV Index:", ltr.uvi, "\t\tLux:", ltr.lux)
                return ltr.uvs 

            except RuntimeError as error:
                # Errors happen fairly often, DHT's are hard to read, just keep going
                print(error.args[0])
                time.sleep(2.0)
                continue
            except Exception as error:
                self.dht_device.exit()
                raise error