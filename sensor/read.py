import time
import board
import adafruit_dht
import requests
import inquirer
#Initial the dht device, with data pin connected to:
dhtDevice = adafruit_dht.DHT11(board.D17)

baseUrl = "https://f293-2610-130-112-601-bb8f-a655-1145-9a85.ngrok-free.app"

# ask for email and password input
email = input("Enter your email: ")
password = input("Enter your password: ")

# make a post request to /login 
loginResp = requests.post(baseUrl + "/login", json={'email' : email, 'password' : password})

#print(loginResp)

# check if the status code is 200
if loginResp.status_code != 200:
    print("Login failed")
    exit()
print("Logged in successfully")

# Extract user id from loginResp
user_id = loginResp.json()['id']
#print(user_id)

#get Users plants
plantResp = requests.get(baseUrl + "/user/" + user_id + "/plants")
#plants = plantResp.json()['plants']
if plantResp.status_code == 200:
    plants = plantResp.json()['plants']
    plant_names_ids = {plant['name']: plant['_id'] for plant in plants}
    plant_names = list(plant_names_ids.keys())

    questions = [
        inquirer.List('plant',
                      message="Which plant do you want to select?",
                      choices=plant_names,
                      ),
    ]

    answers = inquirer.prompt(questions)
    selected_plant_name = answers['plant']
    selected_plant_id = plant_names_ids[selected_plant_name]
    print(selected_plant_name, selected_plant_id)
else:
    print("Failed to fetch plants")

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
temp_data = {
    "user_id" : user_id,
    "data" : {
        "type": "Temp",
        "value" : avg_temp,
        "unit" : "C"
    },
    "plant_id": selected_plant_id
}
temp_Resp = requests.post(baseUrl + "/track", json=temp_data)

