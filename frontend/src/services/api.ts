import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "x-user-id": "test-user-123",
  },
});

export interface Note {
  userId: string;
  noteId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const getNotes = async (): Promise<Note[]> => {
  const response = await api.get("/notes");
  return response.data;
};

export const createNote = async (
  title: string,
  content: string
): Promise<Note> => {
  const response = await api.post("/notes", { title, content });
  return response.data;
};

export const updateNote = async (
  noteId: string,
  title?: string,
  content?: string
): Promise<Note> => {
  const response = await api.put(`/notes/${noteId}`, { title, content });
  return response.data;
};

export const deleteNote = async (noteId: string): Promise<void> => {
  await api.delete(`/notes/${noteId}`);
};

export const searchNotes = async (query: string): Promise<Note[]> => {
  const response = await api.get(
    `/notes/search?q=${encodeURIComponent(query)}`
  );
  return response.data;
};