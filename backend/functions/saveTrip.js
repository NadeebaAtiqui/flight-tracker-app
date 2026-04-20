const { pool } = require('../utils/db');

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { flightData } = body;

    if (!flightData) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Flight data is required' }),
      };
    }

    const query = `
      INSERT INTO saved_trips (
        flight_number,
        airline,
        status,
        departure_airport,
        departure_iata,
        departure_scheduled,
        departure_actual,
        departure_terminal,
        departure_gate,
        departure_delay,
        arrival_airport,
        arrival_iata,
        arrival_scheduled,
        arrival_actual,
        arrival_terminal,
        arrival_gate,
        arrival_baggage
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17
      )
      RETURNING id;
    `;

    const values = [
      flightData.flightNumber,
      flightData.airline,
      flightData.status,
      flightData.departure.airport,
      flightData.departure.iata,
      flightData.departure.scheduled,
      flightData.departure.actual,
      flightData.departure.terminal,
      flightData.departure.gate,
      flightData.departure.delay,
      flightData.arrival.airport,
      flightData.arrival.iata,
      flightData.arrival.scheduled,
      flightData.arrival.actual,
      flightData.arrival.terminal,
      flightData.arrival.gate,
      flightData.arrival.baggage,
    ];

    const result = await pool.query(query, values);
    const savedId = result.rows[0].id;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Trip saved successfully',
        id: savedId,
      }),
    };
  } catch (error) {
    console.error('saveTrip error:', error.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to save trip' }),
    };
  }
};