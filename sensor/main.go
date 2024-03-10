package main

import (
	"fmt"

	"github.com/MichaelS11/go-dht"
	// "github.com/d2r2/go-dht"
)

func main() {
	const GPIO = "GPIO17"

	hosterr := dht.HostInit()
	if hosterr != nil {
		fmt.Println("HostInit error:", hosterr)
		return
	}

	dht, dhterr := dht.NewDHT(GPIO, dht.Fahrenheit, "")
	if dhterr != nil {
		fmt.Println("NewDHT error:", dhterr)
		return
	}

	humidity, temperature, readerr := dht.Read()

	if readerr != nil {
		fmt.Println("Reader error:", readerr)
		return
	}

	fmt.Printf("humidity: %v\n", humidity)
	fmt.Printf("temperature: %v\n", temperature)

	// Temperature from Raspberry Pi with Go

	// err := dht.HostInit()
	// if err != nil {
	// 	fmt.Println("HostInit error:", err)
	// 	return
	// }

	// dht, err := dht.NewDHT("GPIO19", dht.Fahrenheit, "")
	// if err != nil {
	// 	fmt.Println("NewDHT error:", err)
	// 	return
	// }

	// humidity, temperature, err := dht.ReadRetry(11)
	// if err != nil {
	// 	fmt.Println("Read error:", err)
	// 	return
	// }

	// fmt.Printf("humidity: %v\n", humidity)
	// fmt.Printf("temperature: %v\n", temperature)

	// temperature, humidity, retried, err :=
	// 	dht.ReadDHTxxWithRetry(dht.DHT11, 7, false, 10)
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// // Print temperature and humidity
	// fmt.Printf("Temperature = %v*C, Humidity = %v%% (retried %d times)\n",
	// 	temperature, humidity, retried)
}
