const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'http://api.aviationstack.com/v1';
const API_KEY = process.env.AVIATIONSTACK_API_KEY;

// Search for a flight by its IATA flight number e.g. AA1, DL204
const getFlightStatus = async (flightIata) => {
  try {
    const response = await axios.get(`${BASE_URL}/flights`, {
      params: {
        access_key: API_KEY,
        flight_iata: flightIata,
      },
    });

    const flights = response.data.data;

    if (!flights || flights.length === 0) {
      return { error: 'No flight found for that flight number' };
    }

    // Return the most relevant flight info
    const flight = flights[0];
    return {
      flightNumber: flight.flight.iata,
      airline: flight.airline.name,
      status: flight.flight_status,
      departure: {
        airport: flight.departure.airport,
        iata: flight.departure.iata,
        scheduled: flight.departure.scheduled,
        actual: flight.departure.actual,
        terminal: flight.departure.terminal,
        gate: flight.departure.gate,
        delay: flight.departure.delay,
      },
      arrival: {
        airport: flight.arrival.airport,
        iata: flight.arrival.iata,
        scheduled: flight.arrival.scheduled,
        actual: flight.arrival.actual,
        terminal: flight.arrival.terminal,
        gate: flight.arrival.gate,
        baggage: flight.arrival.baggage,
      },
    };
  } catch (error) {
    console.error('AviationStack API error:', error.message);
    return { error: 'Failed to fetch flight data' };
  }
};

module.exports = { getFlightStatus };