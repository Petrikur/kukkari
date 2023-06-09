import React, { useContext, useState } from "react";
import { AuthContext } from "../components/context/authContext";
import LoadingSpinner from "../Ui/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { RiAddLine } from "react-icons/ri";

const NewNote = ({ socket }) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState({
    title: "",
    description: "",
  });

  const noteSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const newNote = {
      title: formState.title,
      description: formState.description,
      name: auth.name,
      userId: auth.userId,
      comments: [],
    };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}` + "/notes/newnote",
        newNote,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
        }
      );
      setIsLoading(false);
      setTimeout(() => {
        toast.success("Muistiinpano lisätty");
      }, 700);
       navigate("/maintenance");
    } catch (err) {
      const errorMessage = err.response.data.message
      toast.warn(errorMessage);
      setIsLoading(false);
      console.log(err);
    }
  };

  const inputHandler = (e) => {
    setFormState({
      ...formState,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <React.Fragment>
      <div className="">
        <form
          className=" max-w-lg mt-20 md:mt-36 flex flex-col px-6 mx-auto justify-center border border-white rounded-md p-10 py-20 bg-gray-800 "
          onSubmit={noteSubmitHandler}
        >
          <h1 className="text-center text-white text-2xl  mb-6">
            Lisää uusi
          </h1>
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="space-y-2 mb-6">
            <label htmlFor="title" className="block text-white font-medium ">
              Otsikko
            </label>
            <input
              id="title"
              type="text"
              className="border border-gray-700 bg-gray-700 rounded-md px-3 py-2 w-full text-white"
              onChange={inputHandler}
              placeholder="Kirjoita otsikko"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-white font-medium"
            >
              Kuvaus <span className="">(Vähintään 5 merkkiä)</span>
            </label>
            <textarea
              placeholder="Kirjoita kuvaus"
              onChange={inputHandler}
              rows={10}
              cols={3}
              id="description"
              className="border text-white bg-gray-700 border-gray-600  rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="text-right flex justify-between items-center mt-2">
            <button
              className=" bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 mt-4 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => {
                navigate("/maintenance");
              }}
            >
              Peruuta
            </button>
            <div className="flex items-center justify-between">
           { !isLoading && <button
              type="submit"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md px-4 mt-4 py-2"
            >
            <RiAddLine size={22}/>
              Lisää
            </button>}
            </div>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
};

export default NewNote;
