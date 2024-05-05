import React from "react";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";

function PlantDetails({ selectedPlant }) {
  const [tempData, setTempData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    console.log("Using effect..." + typeof selectedPlant);
    if (selectedPlant) {
      console.log("making requets in use effect...");
      fetch(`http://localhost:8080/plant/${selectedPlant._id}/telemetry`)
        .then((response) => response.json())
        .then((data) => {
          let maxTemp = Math.min;
          let MaxHumidity = Math.min;
          let minHumidity = Math.max;
          let minTemp = Math.max;
          const tempData = data.telemetryData.filter((d) => {
            if (d >= maxTemp) {
              console.log("found new max temp at" + d);
              maxTemp = d;
            }
            if (d <= minTemp) {
              console.log("found new min temp at" + d);
              minTemp = d;
            }
            return d.date.type === "Temp";
          });
          const humidityData = data.telemetryData.filter((d) => {
            if (d >= MaxHumidity) MaxHumidity = d;
            if (d <= minHumidity) {
              console.log("found new min hum at" + d);
              minHumidity = d;
            }
            return d.date.type === "Humidity";
          });

          if (minHumidity < 40 || maxTemp >= 15) {
            setMsg("It's too hot in here 🥵");
          }
          setTempData(tempData);
          setHumidityData(humidityData);
        });
    }
  }, [selectedPlant]);

  if (!selectedPlant) {
    return <div>Please select a plant</div>;
  }

  console.log({ selectedPlant });
  return (
    <div className="flex flex-col space-y-4">
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="flex space-x-5">
          <div className="flex-1">
            <h2 className="text-xl font-bold">{selectedPlant.name}</h2>
            <p className="text-lg italic">{selectedPlant.scientific_name}</p>
            <p className="text-lg">{selectedPlant.type}</p>
            <p className="text-lg">Soil Mix: {selectedPlant.soil_mix}</p>
            <p className="text-lg">Flowers: {selectedPlant.flowers}</p>
            <p className="text-lg">Fruits: {selectedPlant.fruits}</p>
            <p className="text-lg">Zone: {selectedPlant.zone}</p>
            <p className="text-lg">Sunlight: {selectedPlant.sunlight}</p>
          </div>
          <div className="flex-2">
            <img
              src={selectedPlant.img}
              alt={selectedPlant.name}
              className="object-cover w-full h-72 rounded-lg shadow"
            />
          </div>
        </div>
      </div>
      <div className="flex space-x-4">
        <div className="flex-1 p-4 bg-white rounded-lg shadow">
          <h3 className="text-xl font-bold mb-2">Temperature</h3>
          <LineChart width={500} height={300} data={tempData}>
            <Line type="monotone" dataKey="averageValue" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis />
            {/* TODO: FETCH FROM DB*/}
            <ReferenceLine
              label="Max"
              stroke="red"
              strokeDasharray="3 3"
              y={32.2}
            />
            <ReferenceLine
              label="Low"
              stroke="green"
              strokeDasharray="3 3"
              y={21.1}
            />
            <Tooltip />
          </LineChart>
        </div>
        <div className="flex-1 p-4 bg-white rounded-lg shadow">
          <h3 className="text-xl font-bold mb-2">Humidity</h3>
          <LineChart width={500} height={300} data={humidityData}>
            <Line type="monotone" dataKey="averageValue" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis />
            <ReferenceLine
              label="Max"
              stroke="red"
              strokeDasharray="3 3"
              y={60}
            />
            <ReferenceLine
              label="Low"
              stroke="green"
              strokeDasharray="3 3"
              y={40}
            />
            <Tooltip />
          </LineChart>
        </div>
      </div>
      <div
        className={`flex-1 p-4 rounded-lg ${
          msg === "" ? "bg-green-300" : "bg-red-300"
        } shadow`}
      >
        <p>{msg === "" ? "I am Doing Perfectly Fine 😎" : msg}</p>
      </div>
    </div>
  );
}

export default PlantDetails;
