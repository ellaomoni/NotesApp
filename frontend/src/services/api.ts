import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
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

export const getNotes = async (userId: string): Promise<Note[]> => {
  const response = await api.get("/notes", {
    headers: { "x-user-id": userId },
  });
  return response.data;
};

export const createNote = async (
  userId: string,
  title: string,
  content: string
): Promise<Note> => {
  const response = await api.post(
    "/notes",
    { title, content },
    { headers: { "x-user-id": userId } }
  );
  return response.data;
};

export const updateNote = async (
  userId: string,
  noteId: string,
  title?: string,
  content?: string
): Promise<Note> => {
  const response = await api.put(
    `/notes/${noteId}`,
    { title, content },
    { headers: { "x-user-id": userId } }
  );
  return response.data;
};

export const deleteNote = async (
  userId: string,
  noteId: string
): Promise<void> => {
  await api.delete(`/notes/${noteId}`, {
    headers: { "x-user-id": userId },
  });
};

export const searchNotes = async (
  userId: string,
  query: string
): Promise<Note[]> => {
  const response = await api.get(
    `/notes/search?q=${encodeURIComponent(query)}`,
    { headers: { "x-user-id": userId } }
  );
  return response.data;
};