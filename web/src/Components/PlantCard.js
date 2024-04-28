import React, { useState } from "react";
import axios from "axios";

function PlantCard({ plant, fetchPlants }) {
  const [newName, setNewName] = useState("");
  // console.log({plant})

  const handleNameUpdate = (e) => {
    e.stopPropagation(); // Prevent triggering the click event on the card
    console.log("plant id... " + plant._id);
    axios
      .put(`http://localhost:8080/plants/update/${plant._id}/${newName}`)
      .then(() => {
        fetchPlants(); // Fetch the updated list of plants
      })
      .catch((error) => {
        console.error("Error updating plant name: ", error);
      });
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent triggering the click event on the card
    axios
      .delete(`http://localhost:8080/plants/delete/${plant._id}`)
      .then(() => {
        fetchPlants(); // Fetch the updated list of plants
      })
      .catch((error) => {
        console.error("Error deleting plant: ", error);
      });
  };

  return (
    <div className="border p-4 rounded-lg">
      <div className="flex items-center">
        <div className="flex-1">
          <h2 className="text-xl font-bold">{plant.name}</h2>
          <div className="mt-2 flex items-center">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border p-1 flex-grow mr-2"
              placeholder="New name"
            />
            <button
              onClick={handleNameUpdate}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Update Name
            </button>
          </div>
          <p className="text-sm italic">{plant.scientificName}</p>
          <p>
            <strong>Soil Mix:</strong> {plant.soil_mix}
          </p>
          <p>
            <strong>Flowers:</strong> {plant.flowers}
          </p>
          <p>
            <strong>Fruits:</strong> {plant.fruits}
          </p>
          <p>
            <strong>Zone:</strong> {plant.zone}
          </p>
          <p>
            <strong>Sunlight:</strong> {plant.sunlight}
          </p>
          <p>
            <strong>Type:</strong> {plant.type}
          </p>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete Plant
          </button>
        </div>
        <img
          src={plant.imageUrl}
          alt={plant.name}
          className="w-24 h-24 object-cover rounded-full"
        />
      </div>
    </div>
  );
}

export default PlantCard;
