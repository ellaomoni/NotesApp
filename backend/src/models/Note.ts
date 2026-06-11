//what the note looks like in the database
export interface Note {
    userId: string;  
    noteId: string; //generated when the note is created
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  }
  
  
  //what the user sends in the request body when creating a note
  export interface CreateNoteInput {
    title: string;
    content: string;
  }
  
  //what the user sends in the request body when updating a note
  export interface UpdateNoteInput {
    title?: string;
    content?: string;
  }