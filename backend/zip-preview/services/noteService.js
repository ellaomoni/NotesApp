"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchNotes = exports.deleteNote = exports.updateNote = exports.listNotes = exports.getNoteById = exports.createNote = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const uuid_1 = require("uuid");
const dynamodb_client_1 = require("../utils/dynamodb-client");
//create a new note
const createNote = async (userId, input) => {
    const now = new Date().toISOString();
    const note = {
        userId,
        noteId: (0, uuid_1.v4)(),
        title: input.title,
        content: input.content,
        createdAt: now,
        updatedAt: now,
    };
    await dynamodb_client_1.docClient.send(new lib_dynamodb_1.PutCommand({
        TableName: dynamodb_client_1.TABLE_NAME,
        Item: note,
    }));
    return note;
};
exports.createNote = createNote;
//fetch note by id
const getNoteById = async (userId, noteId) => {
    const result = await dynamodb_client_1.docClient.send(new lib_dynamodb_1.GetCommand({
        TableName: dynamodb_client_1.TABLE_NAME,
        Key: { userId, noteId },
    }));
    return result.Item ?? null;
};
exports.getNoteById = getNoteById;
//fetch all notes for a user
const listNotes = async (userId) => {
    const result = await dynamodb_client_1.docClient.send(new lib_dynamodb_1.QueryCommand({
        TableName: dynamodb_client_1.TABLE_NAME,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ":userId": userId,
        },
    }));
    return result.Items ?? [];
};
exports.listNotes = listNotes;
//update a note
const updateNote = async (userId, noteId, input) => {
    const existing = await (0, exports.getNoteById)(userId, noteId);
    if (!existing)
        return null;
    const updatedNote = {
        ...existing,
        title: input.title ?? existing.title,
        content: input.content ?? existing.content,
        updatedAt: new Date().toISOString(),
    };
    await dynamodb_client_1.docClient.send(new lib_dynamodb_1.PutCommand({
        TableName: dynamodb_client_1.TABLE_NAME,
        Item: updatedNote,
    }));
    return updatedNote;
};
exports.updateNote = updateNote;
//delete a note
const deleteNote = async (userId, noteId) => {
    const existing = await (0, exports.getNoteById)(userId, noteId);
    if (!existing)
        return false;
    await dynamodb_client_1.docClient.send(new lib_dynamodb_1.DeleteCommand({
        TableName: dynamodb_client_1.TABLE_NAME,
        Key: { userId, noteId },
    }));
    return true;
};
exports.deleteNote = deleteNote;
/** Bonus feature
 * Search notes.
 */
const searchNotes = async (userId, query) => {
    const searchTerm = query.toLowerCase();
    const result = await dynamodb_client_1.docClient.send(new lib_dynamodb_1.QueryCommand({
        TableName: dynamodb_client_1.TABLE_NAME,
        KeyConditionExpression: "userId = :userId",
        FilterExpression: "contains(#title, :query) OR contains(#content, :query)",
        ExpressionAttributeNames: {
            "#title": "title",
            "#content": "content",
        },
        ExpressionAttributeValues: {
            ":userId": userId,
            ":query": searchTerm,
        },
    }));
    return result.Items ?? [];
};
exports.searchNotes = searchNotes;
