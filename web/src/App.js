import logo from './logo.svg';
import './App.css';

import React, { useEffect, useState } from 'react';



function PlantList() {


    const [plants, setPlants] = useState([]);

    useEffect( () => {
      console.log("fetching plants...")
      fetchPlants()
      
    }, []);

    async function fetchPlants(type) {
      console.log("fetching??")
     try{
      console.log({type})
      if(type === undefined) {
        console.log("fetching all plants...")
      const res = await fetch("https://43kgdhcf-8080.usw3.devtunnels.ms/plants")
      const plants = await res.json();

      // console.log(plants["plants"])
      setPlants(plants["plants"])
      } else {
        const res = await fetch("https://43kgdhcf-8080.usw3.devtunnels.ms/plants?type=" + type )
        const plants = await res.json();
        console.log(plants["plants"])
        setPlants(plants["plants"])
      }
     } catch (e) {
      console.log(e)
     }
    }

    function displayPlants() {
      console.log("state")
      console.log(plants)
        return (
            <div id="plant-list">
                {plants.map(plant => (
                    <div key={plant.name} className="plant">
                        <h2>{plant.name}</h2>
                        <p><strong>Scientific Name:</strong> {plant.scientific_name}</p>
                        <p><strong>Soil Mix:</strong> {plant.soil_mix}</p>
                        <p><strong>Flowers:</strong> {plant.flowers}</p>
                        <p><strong>Fruits:</strong> {plant.fruits}</p>
                        <p><strong>Zone:</strong> {plant.zone}</p>
                        <p><strong>Sunlight:</strong> {plant.sunlight}</p>
                        <p><strong>Type:</strong> {plant.type}</p>
                    </div>
                ))}
            </div>
        );
    }

    function filterPlants(type) {
        if (type === 'all') {
            fetchPlants()
        } else {
          fetchPlants(type)
        }
    }

    function handleSortButtonClick() {
        const filter = document.getElementById('plant-filter').value;
        console.log('filtering by ' + filter.toLowerCase())
        filterPlants(filter);
    }

    return (
        <div>
            <select id="plant-filter">
            <option value="all">All</option>
        <option value="perennial">Perennial</option>
        <option value="Annual">Annual</option>
        <option value="Houseplant">HousePlants</option>
                {/* Add other options here */}
            </select>
            <button id="sortButton" onClick={handleSortButtonClick}>
                Sort
            </button>
            {displayPlants()}
        </div>
    );
}

export default PlantList;
