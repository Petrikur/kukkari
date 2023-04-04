import React, {useContext, useState } from "react";
import { AuthContext } from "../components/context/authContext";

import LoadingSpinner from "../Ui/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NewNote = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    name: "",
  });

  const noteSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/notes/newnote",
        {
          title: formState.title,
          description: formState.description,
          name: formState.name,
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
          className=" max-w-2xl mt-36 flex flex-col px-6 mx-auto justify-center border rounded-md p-10 py-20"
          onSubmit={noteSubmitHandler}
        >
          {" "}
          <h1 className="text-center text-xl font-bold mb-6">Lisää uusi</h1>
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-gray-700 font-medium">
              Otsikko
            </label>
            <input
              id="title"
              type="text"
              className="border border-gray-400 rounded-md px-3 py-2 w-full"
              onChange={inputHandler}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium"
            >
              Kuvaus
            </label>
            <textarea
              onChange={inputHandler}
              rows={15}
              cols={3}
              id="description"
              className="border border-gray-400 rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="name" className="block text-gray-700 font-medium">
              Nimesi
            </label>
            <input
              id="name"
              type="text"
              className="border border-gray-400 rounded-md px-3 py-2 w-full"
              onChange={inputHandler}
            />
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md px-4 mt-4 py-2"
            >
              Lisää
            </button>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
};

export default NewNote;
