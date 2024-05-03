import React from "react";

function UserPlantList({ userId, plants, setSelectedPlant }) {
    return (
      <div className="space-y-4">
        {plants.map((plant) => (
          <div
            key={plant._id.$oid}
            onClick={() => setSelectedPlant(plant)}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer"
          >
            <div className="flex-1 space-y-1">
              <h2 className="text-xl font-bold">{plant.name}</h2>
              <p className="text-sm italic">{plant.scientific_name}</p>
              <p className="text-sm">{plant.type}</p>
            </div>
            <div className="flex-1">{/* Placeholder for image */}</div>
          </div>
        ))}
      </div>
    );
  }

export default UserPlantList;
