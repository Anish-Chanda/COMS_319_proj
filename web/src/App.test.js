// import { render, screen } from '@testing-library/react';
// import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

// Import the necessary testing utilities
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PlantDetails from './Components/PlantDetails';

// Mock the fetch function
global.fetch = jest.fn();

describe('PlantDetails Component', () => {
  test('displays message when telemetry data is not available', async () => {
    // Mock the fetch call to return no telemetry data
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve({ telemetryData: [] }) });

    render(<PlantDetails selectedPlant={{ _id: 'plant_id' }} />);

    // Wait for the component to render and the useEffect hook to run
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/plant/plant_id/telemetry');
    });

    // Validate that the "Telemetry data not available" message is displayed
    expect(screen.getByText(/Telemetry data not available/i)).toBeInTheDocument();
  });

  test('displays "It\'s too hot, water me please" message when conditions are hot', async () => {
    // Mock the fetch call to return telemetry data with hot conditions
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        telemetryData: [
          { date: { type: 'maxTemp' }, averageValue: 15 }, // Below 15°C
          { date: { type: 'minHumidity' }, averageValue: 40 }, // Below 40% humidity
        ],
      }),
    });

    render(<PlantDetails selectedPlant={{ _id: 'plant_id' }} />);

    // Wait for the component to render and the useEffect hook to run
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/plant/plant_id/telemetry');
    });

    // Validate that the "It's too hot, water me please" message is displayed
    expect(screen.getByText(/It's too hot, water me please/i)).toBeInTheDocument();
  });

  // Write similar test cases for other scenarios
});

