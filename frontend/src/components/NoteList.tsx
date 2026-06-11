import React from "react";
import { Note } from "../types";

interface Props {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
}

const NoteList: React.FC<Props> = ({ notes, onEdit, onDelete }) => {
  if (notes.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">📭</p>
        <p className="text-lg">No notes yet. Create your first one!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {notes.map((note) => (
        <div
          key={note.noteId}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {note.title}
          </h3>
          <p className="text-gray-600 mb-3 whitespace-pre-wrap">
            {note.content}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {new Date(note.createdAt).toLocaleString()}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(note)}
                className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Delete this note?"))
                    onDelete(note.noteId);
                }}
                className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoteList;