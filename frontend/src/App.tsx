import React, { useState, useEffect, useCallback } from "react";
import * as api from "./services/api";
import { Note } from "./types";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import SearchBar from "./components/SearchBar";

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const loadNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getNotes();
      setNotes(data);
    } catch {
      setError("Failed to load notes. Check your API connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleCreate = async (title: string, content: string) => {
    try {
      const note = await api.createNote(title, content);
      setNotes((prev) => [note, ...prev]);
    } catch {
      setError("Failed to create note.");
    }
  };

  const handleUpdate = async (title: string, content: string) => {
    if (!editingNote) return;
    try {
      const updated = await api.updateNote(editingNote.noteId, title, content);
      setNotes((prev) =>
        prev.map((n) => (n.noteId === updated.noteId ? updated : n))
      );
      setEditingNote(null);
    } catch {
      setError("Failed to update note.");
    }
  };

  const handleDelete = async (noteId: string) => {
    try {
      await api.deleteNote(noteId);
      setNotes((prev) => prev.filter((n) => n.noteId !== noteId));
    } catch {
      setError("Failed to delete note.");
    }
  };

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    setIsSearching(true);
    try {
      const results = await api.searchNotes(query);
      setNotes(results);
    } catch {
      setError("Failed to search notes.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setIsSearching(false);
    loadNotes();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 mb-8 shadow-sm">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">📝 Notes App</h1>
          <p className="text-sm text-gray-500">
            Powered by AWS Lambda + DynamoDB
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600 ml-4"
            >
              ✕
            </button>
          </div>
        )}

        <NoteForm
          onSubmit={editingNote ? handleUpdate : handleCreate}
          onCancel={editingNote ? () => setEditingNote(null) : undefined}
          editingNote={editingNote}
        />

        <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />

        {isSearching && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm flex justify-between">
            <span>Showing search results</span>
            <button
              onClick={handleClearSearch}
              className="underline hover:no-underline"
            >
              Show all notes
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">Loading notes...</p>
          </div>
        ) : (
          <NoteList
            notes={notes}
            onEdit={setEditingNote}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  );
};

export default App;
