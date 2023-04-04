import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import LoadingSpinner from "../Ui/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/authContext";
import axios from "axios";

const UpdateNote = () => {
  const auth = useContext(AuthContext);
  const [loadedNote, setLoadedNote] = useState(null);
  const noteId = useParams().noteId;
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNote = async () => {
      try {
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
      } catch (err) {
        console.log(err)
      }
    };
    fetchNote();
  }, [axios, noteId]);

  const noteUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
        setIsLoading(true)
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
   
      setIsLoading(false)
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
        className="mt-36 px-6 max-w-md mx-auto"
        onSubmit={noteUpdateSubmitHandler}
      >
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
          <textarea
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            value={description}
            onChange={inputHandler}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-200 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Peruuta
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Päivitä
          </button>
        </div>
      </form>
    </React.Fragment>
  );
};

export default UpdateNote;
