import React from "react";
import { useState } from "react";

function UserPlantList({ userId, plants, setSelectedPlant, fetchUserPlants }) {
  const [isAddingPlant, setIsAddingPlant] = useState(false);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [allPlants, setAllPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);

  const AddPlant = (plantId) => {
    console.log("add plant called... " + plantId);
    fetch(`http://localhost:8080/user/${userId}/plants/add/${plantId}`, {
      method: "PUT",
    }).then(() => {
      fetchUserPlants(); //either fecth user plants again or ig we cna just update the view
      setIsAddingPlant(false);
      setIsLoading(false);
    });
  };

  const fetchAllPlants = () => {
    fetch("http://localhost:8080/plants")
      .then((res) => res.json())
      .then(async (data) => {
        //wait for 5 secs to test loading
        // await new Promise((res) => setTimeout(res, 5000));
        setFilteredPlants(data.plants);
        setAllPlants(data.plants);
        setIsLoading(false);
      });
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-end">
        <button
          onClick={() => {
            setIsAddingPlant(!isAddingPlant);
            setIsLoading(true);
            fetchAllPlants();
          }}
          className="rounded-lg bg-gray-700 text-lg place-content-end text-white p-2 justify-end w-fit"
        >
          Add Plant
        </button>
      </div>
      {isAddingPlant && (
        <div>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              const term = e.target.value.toLocaleLowerCase();
              const filtered = allPlants.filter((p) => {
                return (
                  p.name.toLowerCase().includes(term) ||
                  p.scientific_name.toLowerCase().includes(term)
                );
              });
              setFilteredPlants(filtered)
            }}
          />
          {isLoading && <p>Getting PLants...</p>}
          <div className="space-y-4 h-screen overflow-y-scroll">
            {filteredPlants.map((plant) => (
              <div
                key={plant._id.$oid}
                onClick={() => AddPlant(plant._id)}
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
        </div>
      )}
      {!isAddingPlant && (
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
      )}
    </div>
  );
}

export default UserPlantList;
