import React, { useState } from "react";
import { FaPencilAlt, FaSave } from "react-icons/fa";
import axios from "axios";

function PlantCard({ plant, onPlantUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlant, setEditedPlant] = useState(plant);

  const handleInputChange = (event) => {
    setEditedPlant({ ...editedPlant, [event.target.name]: event.target.value });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    setIsEditing(false);
    try {
      await axios.post("http://localhost:8080/plants/update", editedPlant);
      onPlantUpdate(editedPlant);
    } catch (error) {
      console.error("Error updating plant", error);
    }
  };

  return (
    <div className="flex items-center border-2 border-gray-300 p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
      <div className="flex-1">
        {isEditing ? (
          <input
            type="text"
            name="name"
            value={editedPlant.name}
            onChange={handleInputChange}
            className="text-xl font-bold"
          />
        ) : (
          <h2 className="text-xl font-bold">{plant.name}</h2>
        )}

        {isEditing ? (
          <input
            type="text"
            name="scientific_name"
            value={editedPlant.scientific_name}
            onChange={handleInputChange}
            className="text-sm italic"
          />
        ) : (
          <p className="text-sm italic">{plant.scientific_name}</p>
        )}
        {isEditing ? (
          <input
            type="text"
            name="type"
            value={editedPlant.type}
            onChange={handleInputChange}
            className="text-sm"
          />
        ) : (
          <p className="text-sm">{plant.type}</p>
        )}
        {isEditing ? (
          <input
            type="text"
            name="soil_mix"
            value={editedPlant.soil_mix}
            onChange={handleInputChange}
            className="text-sm"
          />
        ) : (
          <p className="text-sm">{plant.soil_mix}</p>
        )}

        {isEditing ? (
          <input
            type="text"
            name="flowers"
            value={editedPlant.flowers}
            onChange={handleInputChange}
            className="text-sm"
          />
        ) : (
          <p className="text-sm">{plant.flowers}</p>
        )}

        {isEditing ? (
          <input
            type="text"
            name="fruits"
            value={editedPlant.fruits}
            onChange={handleInputChange}
            className="text-sm"
          />
        ) : (
          <p className="text-sm">{plant.fruits}</p>
        )}

        {isEditing ? (
          <input
            type="text"
            name="zone"
            value={editedPlant.zone}
            onChange={handleInputChange}
            className="text-sm"
          />
        ) : (
          <p className="text-sm">{plant.zone}</p>
        )}

        {isEditing ? (
          <input
            type="text"
            name="sunlight"
            value={editedPlant.sunlight}
            onChange={handleInputChange}
            className="text-sm"
          />
        ) : (
          <p className="text-sm">{plant.sunlight}</p>
        )}
      </div>
      <div>
        <img
          src={plant.img}
          alt={plant.name}
          className="w-24 h-24 object-cover rounded-lg"
        />
      </div>
      <button
        onClick={isEditing ? handleSaveClick : handleEditClick}
        className="ml-4"
      >
        {isEditing ? <FaSave /> : <FaPencilAlt />}
      </button>
    </div>
  );
}

export default PlantCard;
