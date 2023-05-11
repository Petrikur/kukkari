import React, { useState, useEffect, useContext } from "react";
import LoadingSpinner from "../Ui/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/authContext";
import { Link } from "react-router-dom";
import axios from "axios";
import NotesList from "../components/Notes/NotesList";

const NotesPage = () => {
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedNotes, setLoadedNotes] = useState();
  const [searchQuery, setSearchQuery] = useState("");

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

  useEffect(() => {
    getNotes();
  }, []);

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
  };

  return (
    <>
      <React.Fragment>
        {isLoading && (
          <div className="center">
            <LoadingSpinner />
          </div>
        )}
        <div className="flex items-center justify-center pt-28 flex-col py-2 px-4 ">
          <div className="text-white mb-20 ">
            <h1 className="text-4xl mb-5 ">Muistiinpanot</h1>
            <div className="text-md">
              Voit tehdä täällä muistiinpanoja tällä sivulla sekä kirjoittaa
              kommentteja omiin ja muiden tekemiin muistiinpanoihin.
            </div>
            <div className="my-2">
              Jos muistiinpanossa käsitellyt asiat ovat jo tehty / saatu
              valmiiksi / sovittu, muistakaa poistaa vanhat muistiinpanot. Vai
              onko tajunnassa
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
              onDeleteNote={noteDeletedHandler}
            />
          </div>
        )}
      </React.Fragment>
    </>
  );
};

export default NotesPage;
