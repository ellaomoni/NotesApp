import { 
    PutCommand, 
    GetCommand, 
    QueryCommand, 
    DeleteCommand 
  } from "@aws-sdk/lib-dynamodb";
  import { v4 as uuidv4 } from "uuid";
  import { docClient, TABLE_NAME } from "../utils/dynamodb-client";
  import { Note, CreateNoteInput, UpdateNoteInput } from "../models/Note";
  

  //create a new note
  export const createNote = async (
    userId: string,
    input: CreateNoteInput
  ): Promise<Note> => {
    const now = new Date().toISOString();
    const note: Note = {
      userId,
      noteId: uuidv4(),
      title: input.title,
      content: input.content,
      createdAt: now,
      updatedAt: now,
    };
  
    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: note,
    }));
  
    return note;
  };
  
  //fetch note by id
  export const getNoteById = async (
    userId: string,
    noteId: string
  ): Promise<Note | null> => {
    const result = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { userId, noteId },
    }));
  
    return (result.Item as Note) ?? null;
  };
  
  //fetch all notes for a user
  export const listNotes = async (userId: string): Promise<Note[]> => {
    const result = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    }));
  
    return (result.Items as Note[]) ?? [];
  };
  
  //update a note
  export const updateNote = async (
    userId: string,
    noteId: string,
    input: UpdateNoteInput
  ): Promise<Note | null> => {
    const existing = await getNoteById(userId, noteId);
    if (!existing) return null;
  
    const updatedNote: Note = {
      ...existing,
      title: input.title ?? existing.title,
      content: input.content ?? existing.content,
      updatedAt: new Date().toISOString(),
    };
  
    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: updatedNote,
    }));
  
    return updatedNote;
  };
  
  //delete a note
  export const deleteNote = async (
    userId: string,
    noteId: string
  ): Promise<boolean> => {
    const existing = await getNoteById(userId, noteId);
    if (!existing) return false;
  
    await docClient.send(new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { userId, noteId },
    }));
  
    return true;
  };

  /** Bonus feature
   * Search notes.
   */
  export const searchNotes = async (
    userId: string,
    query: string
  ): Promise<Note[]> => {
    const searchTerm = query.toLowerCase();
  
    const result = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "userId = :userId",
      FilterExpression:
        "contains(#title, :query) OR contains(#content, :query)",
      ExpressionAttributeNames: {
        "#title": "title",
        "#content": "content",
      },
      ExpressionAttributeValues: {
        ":userId": userId,
        ":query": searchTerm,
      },
    }));
  
    return (result.Items as Note[]) ?? [];
  };