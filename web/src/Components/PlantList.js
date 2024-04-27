import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PlantCard({ setSelectedPlant }) {
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    axios.get('/user/plants')
      .then(response => {
        setPlants(response.data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {plants.map(plant => (
        <div key={plant.id} className="border p-4 rounded-lg" onClick={() => setSelectedPlant(plant.id)}>
          <div className="flex items-center">
            <div className="flex-1">
              <h2 className="text-xl font-bold">{plant.name}</h2>
              <p className="text-sm italic">{plant.scientificName}</p>
            </div>
            <img src={plant.imageUrl} alt={plant.name} className="w-24 h-24 object-cover rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default PlantCard;