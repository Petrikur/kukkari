import React, { useState, useEffect, useContext } from "react";
import LoadingSpinner from "../Ui/LoadingSpinner";
import { AuthContext } from "../components/context/authContext";
import { Link } from "react-router-dom";
import axios from "axios";
import NotesList from "../components/Notes/NotesList";

const NotesPage = ({ socket }) => {
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedNotes, setLoadedNotes] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);

  const getNotes = async () => {
    setIsLoading(true);
    try {
      const responseData = await axios(
        `${import.meta.env.VITE_SERVER_URL}` + "/notes",
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      setLoadedNotes(responseData.data.notes);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const getUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/users`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      setUsers(response.data.users);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getNotes();
    getUsers();
  }, []);

  const handleNewNote = ({ note }) => {
    setLoadedNotes((prevNotes) => [...prevNotes, note]);
  };

  const handleDeleteNote = ({ id }) => {
    setLoadedNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
  };

  const handleUpdateNote = ({ noteId, note }) => {
    setLoadedNotes((prevNotes) => {
      const updatedNotes = prevNotes.map((prevNote) => {
        if (prevNote._id === noteId) {
          return { ...prevNote, ...note };
        } else {
          return prevNote;
        }
      });
      return updatedNotes;
    });
  };

  useEffect(() => {
    socket.on("newNoteAdd", handleNewNote);
    socket.on("deleteNote", handleDeleteNote);
    socket.on("updateNote", handleUpdateNote);
    return () => {
      socket.off("newNoteAdd", handleNewNote);
      socket.off("deleteNote", handleDeleteNote);
      socket.off("updateNote", handleUpdateNote);
    };
  }, []);

  // required to assign id so that new note is commetable without reload and assign new comment
  useEffect(() => {
    if (loadedNotes) {
      socket.on("updateNoteTest", (data) => {
        const noteIndex = loadedNotes.findIndex(
          (note) => note._id === data.noteId
        );
        if (noteIndex !== -1) {
          const updatedNote = { ...loadedNotes[noteIndex] };
          updatedNote._id = data.noteId;
          updatedNote.id = data.noteId;
          updatedNote.comments = [...updatedNote.comments, data.comment];
          const updatedNotes = [...loadedNotes];
          updatedNotes[noteIndex] = updatedNote;
          setLoadedNotes(updatedNotes);
        }
      });
    }
    return () => {
      socket.off("updateNoteTest");
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <React.Fragment>
        {isLoading && (
          <div className="center">
            <LoadingSpinner />
          </div>
        )}

       <div className="flex flex-col ">

        <div className="flex items-center justify-center pt-28 flex-col py-2 px-4 ">
          <div className="text-white mb-20 ">
            <h1 className="text-4xl mb-5 ">Muistiinpanot</h1>
            <div className="text-md">
              Voit tehdä muistiinpanoja tällä sivulla sekä kirjoittaa
              kommentteja omiin ja muiden tekemiin muistiinpanoihin.
            </div>
            <div className="my-2">
              Jos muistiinpanossa käsitellyt asiat ovat jo tehty / saatu
              valmiiksi, muistakaa poistaa vanhat muistiinpanot.
            </div>
          </div>

          <Link
            className="px-4 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
            to={`/maintenance/newnote`}
          >
            Lisää uusi
          </Link>
          <div className="flex items-center justify-center mt-5">
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full max-w-md rounded-full border-2 border-gray-300 py-2 px-4 mb-4"
              placeholder="Etsi muistiinpanoja..."
            />
          </div>
        </div>

        {!isLoading && loadedNotes && (
          <div className="flex items-center justify-center">
            <NotesList
              searchQuery={searchQuery}
              items={loadedNotes}
              socket={socket}
            />
          </div>
        )}

        <div className="lg:fixed bottom-0 left-0 lg:w-1/5 top-20 lg:h-screen lg:p-4 ml-4 lg:ml-0">
        <h3 className="text-2xl mb-2 text-white">Käyttäjät</h3>
        <ul className="space-y-2">
          {users.map((user,index) => (
            <li className="text-white text-xl ml-4  p-2" key={user._id }>
              {user.name}
            </li>
          ))}
        </ul>
      </div>


    </div>
      </React.Fragment>
    </>
  );
};

export default NotesPage;
