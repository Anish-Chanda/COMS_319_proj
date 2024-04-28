import React, { useState } from 'react';
import axios from 'axios';

function AddPlantForm({fetchPlants}) {
  const [name, setName] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post('http://localhost:8080/plants/add', {
      name,
      scientificName,
      imageUrl
    })
    .then(response => {
      console.log(response);
      fetchPlants()
    })
    .catch(error => {
      console.error('Error adding plant: ', error);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Plant name" required />
      <input type="text" value={scientificName} onChange={e => setScientificName(e.target.value)} placeholder="Scientific name" required />
      <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Image URL" required />
      <button type="submit">Add Plant</button>
    </form>
  );
}

export default AddPlantForm;