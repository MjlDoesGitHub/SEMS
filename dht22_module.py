import adafruit_dht
import time
import board
import random

pin = board.D4

class DHT22Module:
    def __init__(self, id):
        self.id = id
        self.dht_device = adafruit_dht.DHT22(pin)

    def get_id(self):
        return self.id
    
    def get_name(self):
        return "Temperature", "Humidity"

    def get_unit(self):
        return "device_thermostat", "humidity_percentage"

    def get_sensor_readings(self):
        while True:
            try:
                # Print the values to the serial port
                temperature_c = self.dht_device.temperature
                temperature_f = temperature_c * (9 / 5) + 32
                humidity = self.dht_device.humidity
                print(
                    "Temp: {:.1f} F / {:.1f} C    Humidity: {}% ".format(
                        temperature_f, temperature_c, humidity
                    )
                )
                return temperature_c, humidity
                # return random.randint(1,100), random.randint(1,100)

            except RuntimeError as error:
                # Errors happen fairly often, DHT's are hard to read, just keep going
                print(error.args[0])
                time.sleep(2.0)
                continue
            except Exception as error:
                self.dht_device.exit()
                raise error
