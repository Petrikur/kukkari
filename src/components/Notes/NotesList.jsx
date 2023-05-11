import React, { useEffect, useState } from "react";
import NoteItem from "./NoteItem";

const NotesList = ({ items, searchQuery, onDeleteNote }) => {
  const [filteredNotes, setFilteredNotes] = useState(items);

  useEffect(() => {
    const filtered = items.filter(
      (note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.creator.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredNotes(filtered);
  }, [items, searchQuery]);

  if (items.length === 0) {
    return (
      <div className="text-2xl text-center text-white mt-5">
        <h2>Muistiinpanoja ei löytynyt, lisää uusi?</h2>
      </div>
    );
  }

  return (
    <ul className="list-none flex items-center flex-row-reverse justify-center px-4 flex-wrap-reverse gap-10 mt-12">
      {filteredNotes.map((note) => (
        <NoteItem
          key={note.id}
          id={note.id}
          title={note.title}
          description={note.description}
          creator={note.creator}
          onDelete={onDeleteNote}
          name={note.name}
          createdAt={note.createdAt}
          comments={note.comments}
        />
      ))}
    </ul>
  );
};

export default NotesList;
