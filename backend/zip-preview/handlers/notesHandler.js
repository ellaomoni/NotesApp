"use strict";
//Entry points to Lambda functions. 
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNote = exports.updateNote = exports.listNotes = exports.getNoteById = exports.createNote = void 0;
const noteService = __importStar(require("../services/noteService"));
const response_1 = require("../utils/response");
// ─── Helper ────────────────────────────────────────────────────────────────
const extractUserId = (event) => {
    return (event.headers["x-user-id"] ||
        event.headers["X-User-Id"] ||
        null);
};
// ─── Create Note ───────────────────────────────────────────────────────────
const createNote = async (event) => {
    try {
        const userId = extractUserId(event);
        if (!userId) {
            return (0, response_1.errorResponse)(401, "Unauthorized: missing user identity");
        }
        if (!event.body) {
            return (0, response_1.errorResponse)(400, "Request body is required");
        }
        //parse the raw string into a JavaScript object.
        const body = JSON.parse(event.body);
        if (!body.title || !body.content) {
            return (0, response_1.errorResponse)(400, "Title and content are required");
        }
        const note = await noteService.createNote(userId, body);
        return (0, response_1.successResponse)(201, note);
    }
    catch (error) {
        console.error("createNote error:", error);
        return (0, response_1.errorResponse)(500, "Internal server error");
    }
};
exports.createNote = createNote;
// ─── Get Note By ID ────────────────────────────────────────────────────────
const getNoteById = async (event) => {
    try {
        const userId = extractUserId(event);
        if (!userId) {
            return (0, response_1.errorResponse)(401, "Unauthorized: missing user identity");
        }
        const noteId = event.pathParameters?.noteId;
        if (!noteId) {
            return (0, response_1.errorResponse)(400, "noteId is required");
        }
        const note = await noteService.getNoteById(userId, noteId);
        if (!note) {
            return (0, response_1.errorResponse)(404, "Note not found");
        }
        return (0, response_1.successResponse)(200, note);
    }
    catch (error) {
        console.error("getNoteById error:", error);
        return (0, response_1.errorResponse)(500, "Internal server error");
    }
};
exports.getNoteById = getNoteById;
// ─── List Notes ────────────────────────────────────────────────────────────
const listNotes = async (event) => {
    try {
        const userId = extractUserId(event);
        if (!userId) {
            return (0, response_1.errorResponse)(401, "Unauthorized: missing user identity");
        }
        const notes = await noteService.listNotes(userId);
        return (0, response_1.successResponse)(200, notes);
    }
    catch (error) {
        console.error("listNotes error:", error);
        return (0, response_1.errorResponse)(500, "Internal server error");
    }
};
exports.listNotes = listNotes;
// ─── Update Note ───────────────────────────────────────────────────────────
const updateNote = async (event) => {
    try {
        const userId = extractUserId(event);
        if (!userId) {
            return (0, response_1.errorResponse)(401, "Unauthorized: missing user identity");
        }
        const noteId = event.pathParameters?.noteId;
        if (!noteId) {
            return (0, response_1.errorResponse)(400, "noteId is required");
        }
        if (!event.body) {
            return (0, response_1.errorResponse)(400, "Request body is required");
        }
        const body = JSON.parse(event.body);
        if (!body.title && !body.content) {
            return (0, response_1.errorResponse)(400, "At least one of title or content is required");
        }
        const updated = await noteService.updateNote(userId, noteId, body);
        if (!updated) {
            return (0, response_1.errorResponse)(404, "Note not found");
        }
        return (0, response_1.successResponse)(200, updated);
    }
    catch (error) {
        console.error("updateNote error:", error);
        return (0, response_1.errorResponse)(500, "Internal server error");
    }
};
exports.updateNote = updateNote;
// ─── Delete Note ───────────────────────────────────────────────────────────
const deleteNote = async (event) => {
    try {
        const userId = extractUserId(event);
        if (!userId) {
            return (0, response_1.errorResponse)(401, "Unauthorized: missing user identity");
        }
        const noteId = event.pathParameters?.noteId;
        if (!noteId) {
            return (0, response_1.errorResponse)(400, "noteId is required");
        }
        const deleted = await noteService.deleteNote(userId, noteId);
        if (!deleted) {
            return (0, response_1.errorResponse)(404, "Note not found");
        }
        return (0, response_1.successResponse)(200, { message: "Note deleted successfully" });
    }
    catch (error) {
        console.error("deleteNote error:", error);
        return (0, response_1.errorResponse)(500, "Internal server error");
    }
};
exports.deleteNote = deleteNote;
