const { getFlightStatus } = require('../utils/aviationstack');

// This is the handler function that AWS Lambda will call
// when your mobile app makes a request to the API Gateway endpoint
exports.handler = async (event) => {
  
  // Extract the flight number from the request
  // API Gateway passes query parameters inside event.queryStringParameters
  const flightIata = event.queryStringParameters?.flightIata;

  // If no flight number was provided, return a 400 Bad Request
  if (!flightIata) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Flight number is required' }),
    };
  }

  // Call our AviationStack utility function
  const result = await getFlightStatus(flightIata);

  // If the utility returned an error, send a 404
  if (result.error) {
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    };
  }

  // Everything went well — return the flight data with a 200 OK
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result),
  };
};