import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import LoadingSpinner from "../Ui/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/authContext";
import axios from "axios";

export function MaterialSymbolsRefresh(props) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="#888888" d="M12 20q-3.35 0-5.675-2.325T4 12q0-3.35 2.325-5.675T12 4q1.725 0 3.3.712T18 6.75V4h2v7h-7V9h4.2q-.8-1.4-2.188-2.2T12 6Q9.5 6 7.75 7.75T6 12q0 2.5 1.75 4.25T12 18q1.925 0 3.475-1.1T17.65 14h2.1q-.7 2.65-2.85 4.325T12 20Z"></path></svg>
    )
  }

const UpdateNote = () => {
  const auth = useContext(AuthContext);
  const [loadedNote, setLoadedNote] = useState(null);
  const noteId = useParams().noteId;
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setIsLoading(true)
        const responseData = await axios.get(
          `http://localhost:5000/api/notes/${noteId}`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setLoadedNote(responseData.data.note);
        setTitle(responseData.data.note.title);
        setDescription(responseData.data.note.description);
        setIsLoading(false)
      } catch (err) {
        console.log(err);
        setIsLoading(false)
      }
    };
    fetchNote();
  }, [axios, noteId]);

  const noteUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      await axios.patch(
        `http://localhost:5000/api/notes/${noteId}`,
        {
          title: title,
          description: description,
          userId: auth.userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
        }
      );

      setIsLoading(false);
      navigate("/maintenance");
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedNote) {
    return (
      <div className="center">
        <h2>Muistiinpanoja ei löytynyt!</h2>
      </div>
    );
  }
  const inputHandler = (event) => {
    if (event.target.id === "title") {
      setTitle(event.target.value);
    } else if (event.target.id === "description") {
      setDescription(event.target.value);
    }
  };

  return (
    <React.Fragment>
      <form
        className="mt-32 max-w-2xl mx-auto border rounded py-12 sm:px-4"
        onSubmit={noteUpdateSubmitHandler}
      ><h1 className="text-xl font-bold mb-6 text-center">Muokkaa muistiinpanoa</h1>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="title">
            Otsikko
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            type="text"
            value={title}
            onChange={inputHandler}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="description"
          >
            Kuvaus
          </label>
          <textarea rows={20}
          cols={2}
            className="h-fit appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            value={description}
            onChange={inputHandler}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className=" bg-blue-200 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => {navigate("/maintenance")}}
          >
            Peruuta
          </button>
          <button
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          ><MaterialSymbolsRefresh/>
            Päivitä
          </button>
        </div>
      </form>
    </React.Fragment>
  );
};

export default UpdateNote;
