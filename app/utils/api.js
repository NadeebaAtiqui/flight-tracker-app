const BASE_URL = 'https://fabwnw59qa.execute-api.us-east-1.amazonaws.com/prod';

export const searchFlight = async (flightIata) => {
  const response = await fetch(`${BASE_URL}/flight?flightIata=${flightIata}`);
  const data = await response.json();
  return data;
};

export const saveTrip = async (flightData) => {
  const response = await fetch(`${BASE_URL}/trip`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ flightData }),
  });
  const data = await response.json();
  return data;
};

export const getTrips = async () => {
  const response = await fetch(`${BASE_URL}/trips`);
  const data = await response.json();
  return data;
};