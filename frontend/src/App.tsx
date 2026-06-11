import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "./services/supabase";
import { Session } from "@supabase/supabase-js";
import * as api from "./services/api";
import { Note } from "./types";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import SearchBar from "./components/SearchBar";
import Auth from "./components/Auth";

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  const loadNotes = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getNotes(session.user.id);
      setNotes(data);
    } catch {
      setError("Failed to load notes. Check your API connection.");
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) loadNotes();
  }, [session, loadNotes]);

  const handleCreate = async (title: string, content: string) => {
    if (!session) return;
    try {
      const note = await api.createNote(session.user.id, title, content);
      setNotes((prev) => [note, ...prev]);
    } catch {
      setError("Failed to create note.");
    }
  };

  const handleUpdate = async (title: string, content: string) => {
    if (!editingNote || !session) return;
    try {
      const updated = await api.updateNote(
        session.user.id,
        editingNote.noteId,
        title,
        content
      );
      setNotes((prev) =>
        prev.map((n) => (n.noteId === updated.noteId ? updated : n))
      );
      setEditingNote(null);
    } catch {
      setError("Failed to update note.");
    }
  };

  const handleDelete = async (noteId: string) => {
    if (!session) return;
    try {
      await api.deleteNote(session.user.id, noteId);
      setNotes((prev) => prev.filter((n) => n.noteId !== noteId));
    } catch {
      setError("Failed to delete note.");
    }
  };

  const handleSearch = async (query: string) => {
    if (!session) return;
    setLoading(true);
    setError(null);
    setIsSearching(true);
    try {
      const results = await api.searchNotes(session.user.id, query);
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

  if (!session) return <Auth />;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 mb-8 shadow-sm">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📝 Notes App</h1>
            <p className="text-sm text-gray-500">{session.user.email}</p>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-4">✕</button>
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
            <button onClick={handleClearSearch} className="underline">
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