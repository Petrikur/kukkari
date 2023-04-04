import React, { useState, useEffect, useContext } from "react";
import LoadingSpinner from "../Ui/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/authContext";
import { Link } from "react-router-dom";
import axios from "axios";
import NotesList from "../components/Notes/NotesList";

const NotesPage = (props) => {
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  // const [loadedUsers, setloadedUsers] = useState();
  const [loadedNotes, setLoadedNotes] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const getNotes = async () => {
      setIsLoading(true);
      try {
        const responseData = await axios("http://localhost:5000/api/notes", {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        setLoadedNotes(responseData.data.notes);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };

    getNotes();
  }, [axios]);

  if (isLoading) {

    return (
      <div className="">
        <LoadingSpinner />
      </div>
    );
  }

  const noteDeletedHandler = (deletedNoteId) => {
    setLoadedNotes((prevNotes) =>
      prevNotes.filter((note) => note.id !== deletedNoteId)
    );
    // navigate("/maintenance");
  };

  return (
    <>
      <h1>Kukkarin Muistiinpanot</h1>
      <button className="">
        <Link to="/maintenance/newnote">Lisää uusi</Link>
      </button>
      <React.Fragment>
        {isLoading && (
          <div className="center">
            {" "}
            <LoadingSpinner />
          </div>
        )}
        {!isLoading && loadedNotes && (
          <div className="">
            <NotesList items={loadedNotes} onDeleteNote={noteDeletedHandler} />
          </div>
        )}
      </React.Fragment>
    </>
  );
};

export default NotesPage;
