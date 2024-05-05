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
      console.log("making requests in useEffect...");
      fetch(`http://localhost:8080/plant/${selectedPlant._id}/telemetry`)
        .then((response) => response.json())
        .then((data) => {
          if (!data || !data.telemetryData || data.telemetryData.length === 0) {
            // Handle case where telemetry data is null or empty
            setTempData(null);
            setHumidityData(null);
            setMsg("Telemetry data not available");
            return;
          }
  
          let maxTemp = Number.MIN_SAFE_INTEGER;
          let minTemp = Number.MAX_SAFE_INTEGER;
          let maxHumidity = Number.MIN_SAFE_INTEGER;
          let minHumidity = Number.MAX_SAFE_INTEGER;
  
          const tempData = [];
          const humidityData = [];
  
          data.telemetryData.forEach((d) => {
            if (d.date.type === "Temp") {
              tempData.push(d);
              maxTemp = Math.max(maxTemp, d.averageValue);
              minTemp = Math.min(minTemp, d.averageValue);
            } else if (d.date.type === "Humidity") {
              humidityData.push(d);
              maxHumidity = Math.max(maxHumidity, d.averageValue);
              minHumidity = Math.min(minHumidity, d.averageValue);
            }
          });
  
          if (minHumidity < 40 && maxTemp >= 15) {
            setMsg("It's too hot, water me please");
          } else if(maxHumidity >90 && minTemp < -4 ){
            setMsg("It's too humid and cold, place me somewhere warm");
          }
            else {
            setMsg("Conditions are normal");
          }
  
          setTempData(tempData.length > 0 ? tempData : null);
          setHumidityData(humidityData.length > 0 ? humidityData : null);
        })
        .catch((error) => {
          console.error("Error fetching telemetry data:", error);
          setTempData(null);
          setHumidityData(null);
          setMsg("Error fetching telemetry data");
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
      {/* Somewhere in your JSX, you can display the msg */}
    <div
      className={`flex-1 p-4 rounded-lg ${
        msg === "Conditions are normal" ? "bg-green-300" : "bg-red-300"
      } shadow`}
    >
      <p>{msg}</p>
    </div>
      </div>
  );
}

export default PlantDetails;
