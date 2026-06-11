import React, { useState, useEffect } from "react";
import { Note } from "../types";

interface Props {
  onSubmit: (title: string, content: string) => void;
  onCancel?: () => void;
  editingNote?: Note | null;
}

const NoteForm: React.FC<Props> = ({ onSubmit, onCancel, editingNote }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [editingNote]);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      alert("Title and content are required");
      return;
    }
    onSubmit(title.trim(), content.trim());
    setTitle("");
    setContent("");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {editingNote ? "✏️ Edit Note" : "➕ New Note"}
      </h2>
      <input
        type="text"
        placeholder="Note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        placeholder="Note content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          {editingNote ? "Update Note" : "Create Note"}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default NoteForm;