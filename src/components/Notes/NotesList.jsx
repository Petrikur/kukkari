import React from 'react';
import NoteItem from "./NoteItem"

const NotesList = props => {
  if (props.items.length === 0) {
    return (
      <div className="">
          <h2>Muistiinpanoja ei löytynyt, lisää uusi?</h2>
      </div>
    );
  }
  console.log("props: " + props)

  for(let prop in props){
    console.log(prop)
  }

  return (
    <ul className="list-none flex items-center justify-center px-4 flex-wrap gap-10 mt-12">
      {props.items.map(note => (
        <NoteItem
          key={note.id}
          id={note.id}
          title={note.title}
          description={note.description}
          creator={note.creator}
          onDelete={props.onDeleteNote}
          name={note.name}
        />
      ))}
    </ul>
  );
};

export default NotesList;
