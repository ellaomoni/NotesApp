import "dotenv/config";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import * as notesHandler from "./notesHandler";

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const method = event.requestContext.http.method;
  const path = event.requestContext.http.path;

  console.log(`${method} ${path}`);

  // POST /notes
  if (method === "POST" && path === "/notes") {
    return notesHandler.createNote(event as any);
  }

  // GET /notes/search  ← must come BEFORE /notes/{noteId}
  if (method === "GET" && path === "/notes/search") {
    return notesHandler.searchNotes(event as any);
  }

  // GET /notes
  if (method === "GET" && path === "/notes") {
    return notesHandler.listNotes(event as any);
  }

  // GET /notes/{noteId}
  if (method === "GET" && path.startsWith("/notes/")) {
    return notesHandler.getNoteById(event as any);
  }

  // PUT /notes/{noteId}
  if (method === "PUT" && path.startsWith("/notes/")) {
    return notesHandler.updateNote(event as any);
  }

  // DELETE /notes/{noteId}
  if (method === "DELETE" && path.startsWith("/notes/")) {
    return notesHandler.deleteNote(event as any);
  }

// Handle CORS 
if (method === "OPTIONS") {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,Authorization,x-user-id",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    },
    body: "",
  };
}

  return {
    statusCode: 404,
    body: JSON.stringify({ error: "Route not found" }),
  };
};