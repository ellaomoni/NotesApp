import { APIGatewayProxyResult } from "aws-lambda";

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", //allow requests from any origin
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
};


//response for successful requests
export const successResponse = (
  statusCode: number,
  data: unknown
): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(data),
  };
};

// response for errors
export const errorResponse = (
  statusCode: number,
  message: string
): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: DEFAULT_HEADERS,
    body: JSON.stringify({ error: message }),
  };
};