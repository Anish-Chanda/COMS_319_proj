import time
import board
import adafruit_dht
#Initial the dht device, with data pin connected to:
dhtDevice = adafruit_dht.DHT11(board.D17)

data = []

while len(data) <5:
    try:
         # Print the values to the serial port
         temperature_c = dhtDevice.temperature
         temperature_f = temperature_c * (9 / 5) + 32
         humidity = dhtDevice.humidity
         data.append((temperature_c,humidity))
         print("Temp: {:.1f} F / {:.1f} C Humidity: {}% ".format(temperature_f, temperature_c, humidity))
         print("added successfull read")
    except RuntimeError as error:
        # Errors happen fairly often, DHT's are hard to read, just keep going
        print(error.args[0])
    time.sleep(2.0)

#calculate average of data
avg_temp = (sum(temp for temp, _ in data)) / len(data)
avg_hum = (sum(hum for _, hum in data)) / len(data)

print("Average temp is: ", avg_temp)
print("Average humidity is: ", avg_hum)

#add to database


