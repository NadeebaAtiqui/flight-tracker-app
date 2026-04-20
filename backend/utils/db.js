const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false },
});

const createTables = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS saved_trips (
      id SERIAL PRIMARY KEY,
      flight_number VARCHAR(10) NOT NULL,
      airline VARCHAR(100),
      status VARCHAR(20),
      departure_airport VARCHAR(100),
      departure_iata VARCHAR(5),
      departure_scheduled TIMESTAMP,
      departure_actual TIMESTAMP,
      departure_terminal VARCHAR(10),
      departure_gate VARCHAR(10),
      departure_delay INTEGER,
      arrival_airport VARCHAR(100),
      arrival_iata VARCHAR(5),
      arrival_scheduled TIMESTAMP,
      arrival_actual TIMESTAMP,
      arrival_terminal VARCHAR(10),
      arrival_gate VARCHAR(10),
      arrival_baggage VARCHAR(20),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(query);
  console.log('Tables created successfully');
};

module.exports = { pool, createTables };