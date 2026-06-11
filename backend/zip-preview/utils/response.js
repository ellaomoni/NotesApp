"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const DEFAULT_HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", //allow requests from any origin
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
};
//response for successful requests
const successResponse = (statusCode, data) => {
    return {
        statusCode,
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(data),
    };
};
exports.successResponse = successResponse;
// response for errors
const errorResponse = (statusCode, message) => {
    return {
        statusCode,
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({ error: message }),
    };
};
exports.errorResponse = errorResponse;
