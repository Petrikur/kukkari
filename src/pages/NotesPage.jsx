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
     
      {/* <button className="">
        <Link to="/maintenance/newnote">Lisää uusi</Link>
      </button> */}
      <React.Fragment>
        {isLoading && (
          <div className="center">
            <LoadingSpinner />
          </div>
        )}
        
        <h1 className=" mt-24 block text-center text-2xl font-bold mb-6">Kukkarin Muistiinpanot</h1>
        <div className="pt-10 flex items-center justify-center p-4 p">
        <Link
              className="px-4 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              to={`/maintenance/newnote`}
            >
              Lisää uusi
            </Link></div>
        {!isLoading && loadedNotes && (
          <div className="flex items-center justify-center">
            <NotesList items={loadedNotes} onDeleteNote={noteDeletedHandler} />
          </div>
        )}
      </React.Fragment>
    </>
  );
};

export default NotesPage;
