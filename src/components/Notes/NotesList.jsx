import React from 'react';
import NoteItem from "./NoteItem"

const NotesList = props => {
  if (props.items.length === 0) {
    return (
      <div className="text-2xl  text-white mt-5">
          <h2>Muistiinpanoja ei löytynyt, lisää uusi?</h2>
      </div>
    );
  }

  return (
    <ul className="list-none flex items-center flex-row-reverse justify-center px-4 flex-wrap-reverse gap-10 mt-12">
      {props.items.map(note => (
        <NoteItem
          key={note.id}
          id={note.id}
          title={note.title}
          description={note.description}
          creator={note.creator}
          onDelete={props.onDeleteNote}
          name={note.name}
          createdAt={note.createdAt}
          comments= {note.comments}
        />
      ))}
    </ul>
  );
};

export default NotesList;
