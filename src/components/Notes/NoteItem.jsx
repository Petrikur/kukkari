import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import Modal from "../../Ui/Modal";
import axios from "axios";
import LoadingSpinner from "../../Ui/LoadingSpinner";


const NoteItem = (props) => {
  const auth = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setIsLoading(true);
    try {
     await axios.delete(
        `http://localhost:5000/api/notes/${props.id}`,
        {
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        }
      );
      props.onDelete(props.id)
      setShowConfirmModal(false);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner />}
      <Modal
        show={showConfirmModal}
        onClose={cancelDeleteHandler}
        header="Oletko varma?"
        footer={
          <React.Fragment>
            <div className="flex">
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                onClick={cancelDeleteHandler}
              >
                Peruuta
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 ml-2"
                onClick={confirmDeleteHandler}
              >
                Poista
              </button>
            </div>
          </React.Fragment>
        }
      >
        <p>Oletko varma että haluat poistaa muistiinpanon?</p>
      </Modal>
      <li className="border rounded-lg shadow-md bg-white p-4 mb-4 ">
        <div className="mb-4 whitespace-normal max-w-xl">
          <h2 className="text-lg font-bold mb-2">{props.title}</h2>
          <div className="text-gray-600 whitespace-normal flex flex-wrap">
            {" "}
            {props.description}
          </div>
        </div>
        <hr></hr>

        <div className=" text-sm text-gray-500 mt-3 justify-center flex items-center">
          Jättänyt: {props.name}
        </div>

        <div className="mt-5 flex items-center justify-end ">
          {auth.userId === props.creator && (
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              to={`/maintenance/${props.id}`}
            >
              Muokkaa
            </button>
          )}
          {auth.userId === props.creator && (
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 ml-2"
              onClick={showDeleteWarningHandler}
            >
              Poista
            </button>
          )}
        </div>
      </li>
    </React.Fragment>
  );
};

export default NoteItem;
