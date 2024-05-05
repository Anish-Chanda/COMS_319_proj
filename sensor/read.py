import time
import board
import adafruit_dht
import requests
#Initial the dht device, with data pin connected to:
dhtDevice = adafruit_dht.DHT11(board.D17)

# ask for email and password input
email = input("Enter your email: ")
password = input("Enter your password: ")

# make a post request to /login 
loginResp = requests.post("http://localhost/login", data={'email' : email, 'password' : password})

# check if the status code is 200
if loginResp.status_code != 200:
    print("Login failed")
    exit()
# Extract user id from loginResp
user_id = loginResp.json()['id']
print(user_id)

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


