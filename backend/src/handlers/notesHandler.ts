//Entry points to Lambda functions. 

import { APIGatewayProxyEvent, APIGatewayProxyEventV2,APIGatewayProxyResult } from "aws-lambda";
import * as noteService from "../services/noteService";
import { successResponse, errorResponse } from "../utils/response";
import { CreateNoteInput, UpdateNoteInput } from "../models/Note";

// ─── Helper ────────────────────────────────────────────────────────────────

const extractUserId = (event: APIGatewayProxyEvent): string | null => {
  return (
    event.headers["x-user-id"] ||
    event.headers["X-User-Id"] ||
    null
  );
};

// ─── Create Note ───────────────────────────────────────────────────────────

export const createNote = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const userId = extractUserId(event);
    if (!userId) {
      return errorResponse(401, "Unauthorized: missing user identity");
    }

    if (!event.body) {
      return errorResponse(400, "Request body is required");
    }

    //parse the raw string into a JavaScript object.
    const body = JSON.parse(event.body) as CreateNoteInput;

    if (!body.title || !body.content) {
      return errorResponse(400, "Title and content are required");
    }

    const note = await noteService.createNote(userId, body);
    return successResponse(201, note);

  } catch (error) {
    console.error("createNote error:", error);
    return errorResponse(500, "Internal server error");
  }
};

// ─── Get Note By ID ────────────────────────────────────────────────────────

export const getNoteById = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const userId = extractUserId(event);
    if (!userId) {
      return errorResponse(401, "Unauthorized: missing user identity");
    }

    const noteId = event.pathParameters?.noteId;
    if (!noteId) {
      return errorResponse(400, "noteId is required");
    }

    const note = await noteService.getNoteById(userId, noteId);
    if (!note) {
      return errorResponse(404, "Note not found");
    }

    return successResponse(200, note);

  } catch (error) {
    console.error("getNoteById error:", error);
    return errorResponse(500, "Internal server error");
  }
};

// ─── List Notes ────────────────────────────────────────────────────────────

export const listNotes = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const userId = extractUserId(event);
    if (!userId) {
      return errorResponse(401, "Unauthorized: missing user identity");
    }

    const notes = await noteService.listNotes(userId);
    return successResponse(200, notes);

  } catch (error) {
    console.error("listNotes error:", error);
    return errorResponse(500, "Internal server error");
  }
};

// ─── Update Note ───────────────────────────────────────────────────────────

export const updateNote = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const userId = extractUserId(event);
    if (!userId) {
      return errorResponse(401, "Unauthorized: missing user identity");
    }

    const noteId = event.pathParameters?.noteId;
    if (!noteId) {
      return errorResponse(400, "noteId is required");
    }

    if (!event.body) {
      return errorResponse(400, "Request body is required");
    }

    const body = JSON.parse(event.body) as UpdateNoteInput;

    if (!body.title && !body.content) {
      return errorResponse(400, "At least one of title or content is required");
    }

    const updated = await noteService.updateNote(userId, noteId, body);
    if (!updated) {
      return errorResponse(404, "Note not found");
    }

    return successResponse(200, updated);

  } catch (error) {
    console.error("updateNote error:", error);
    return errorResponse(500, "Internal server error");
  }
};

// ─── Delete Note ───────────────────────────────────────────────────────────

export const deleteNote = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const userId = extractUserId(event);
    if (!userId) {
      return errorResponse(401, "Unauthorized: missing user identity");
    }

    const noteId = event.pathParameters?.noteId;
    if (!noteId) {
      return errorResponse(400, "noteId is required");
    }

    const deleted = await noteService.deleteNote(userId, noteId);
    if (!deleted) {
      return errorResponse(404, "Note not found");
    }

    return successResponse(200, { message: "Note deleted successfully" });

  } catch (error) {
    console.error("deleteNote error:", error);
    return errorResponse(500, "Internal server error");
  }
};

// ─── Search Notes ──────────────────────────────────────────────────────────
// Bonus feature
export const searchNotes = async (
    event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult> => {
    try {
      const userId = extractUserId(event);
      if (!userId) {
        return errorResponse(401, "Unauthorized: missing user identity");
      }
  
      const query = event.queryStringParameters?.q;
      if (!query || query.trim() === "") {
        return errorResponse(400, "Search query parameter 'q' is required");
      }
  
      const notes = await noteService.searchNotes(userId, query.trim());
      return successResponse(200, notes);
  
    } catch (error) {
      console.error("searchNotes error:", error);
      return errorResponse(500, "Internal server error");
    }
  };