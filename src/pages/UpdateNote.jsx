import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import LoadingSpinner from "../Ui/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/authContext";
import axios from "axios";
import { toast } from "react-toastify";
import { RiPencilLine } from "react-icons/ri";

const UpdateNote = () => {
  const auth = useContext(AuthContext);
  const [loadedNote, setLoadedNote] = useState(null);
  const noteId = useParams().noteId;
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setIsLoading(true);
        const responseData = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}` + `/notes/${noteId}`,
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
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setTimeout(() => {
          toast.warn(err.response.data.message);
        }, 300);
        setIsLoading(false);
      }
    };
    fetchNote();
  }, [noteId]);

  const noteUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      setError(description.length < 8);

      await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}` + `/notes/${noteId}`,
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
      setTimeout(() => {
        toast.success("Muistiinpano Päivitetty");
      }, 700);
      setIsLoading(false);
      navigate("/maintenance");
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      toast.warn(err.response.data.message);
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
        className=" max-w-lg mt-20 md:mt-36 flex flex-col px-6 mx-auto justify-center border border-white rounded-md p-10 py-20 bg-gray-800"
        onSubmit={noteUpdateSubmitHandler}
      >
        <h1 className=" mb-6 text-center text-white text-2xl">
          Muokkaa muistiinpanoa
        </h1>
        <div className="mb-4">
          <label className="block text-white  mb-2" htmlFor="title">
            Otsikko
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
            id="title"
            type="text"
            value={title}
            onChange={inputHandler}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-white font-bold mb-2"
            htmlFor="description"
          >
            Kuvaus
          </label>
          <textarea
            placeholder="Kirjoita vähintään 8 merkkiä"
            rows={14}
            cols={2}
            className="h-fit appearance-none border bg-gray-700 border-gray-600  text-white rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            value={description}
            onChange={inputHandler}
          />
          {error && <div className="text-red-500">{"Kirjoita vähintään 8 merkkiä"}</div>}
        </div>
        <div className="flex items-center justify-between">
          <button
            className=" bg-blue-600 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => {
              navigate("/maintenance");
            }}
          >
            Peruuta
          </button>
          <button
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
             <RiPencilLine size={22}/>
            Päivitä
          </button>
        </div>
      </form>
      
    </React.Fragment>
  );
};

export default UpdateNote;
