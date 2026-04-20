const { pool } = require('../utils/db');

exports.handler = async (event) => {
  try {
    const query = `
      SELECT
        id,
        flight_number AS "flightNumber",
        airline,
        status,
        departure_airport AS "airport",
        departure_iata AS "iata",
        departure_scheduled AS "scheduled",
        departure_actual AS "actual",
        departure_terminal AS "terminal",
        departure_gate AS "gate",
        departure_delay AS "delay",
        arrival_airport,
        arrival_iata,
        arrival_scheduled,
        arrival_actual,
        arrival_terminal,
        arrival_gate,
        arrival_baggage,
        created_at
      FROM saved_trips
      ORDER BY created_at DESC;
    `;

    const result = await pool.query(query);

    const trips = result.rows.map(row => ({
      id: row.id.toString(),
      flightNumber: row.flightNumber,
      airline: row.airline,
      status: row.status,
      departure: {
        airport: row.airport,
        iata: row.iata,
        scheduled: row.scheduled,
        actual: row.actual,
        terminal: row.terminal,
        gate: row.gate,
        delay: row.delay,
      },
      arrival: {
        airport: row.arrival_airport,
        iata: row.arrival_iata,
        scheduled: row.arrival_scheduled,
        actual: row.arrival_actual,
        terminal: row.arrival_terminal,
        gate: row.arrival_gate,
        baggage: row.arrival_baggage,
      },
    }));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trips),
    };
  } catch (error) {
    console.error('getTrips error:', error.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to fetch trips' }),
    };
  }
};