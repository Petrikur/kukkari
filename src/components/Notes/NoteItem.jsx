import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import Modal from "../../Ui/Modal";
import axios from "axios";
import LoadingSpinner from "../../Ui/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export function MaterialSymbolsEditSharp(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="#888888"
        d="m19.3 8.925l-4.25-4.2L17.875 1.9L22.1 6.125ZM3 21v-4.25l10.6-10.6l4.25 4.25L7.25 21Z"
      ></path>
    </svg>
  );
}

export function MaterialSymbolsAccountCircle(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="#888888"
        d="M5.85 17.1q1.275-.975 2.85-1.538T12 15q1.725 0 3.3.563t2.85 1.537q.875-1.025 1.363-2.325T20 12q0-3.325-2.337-5.663T12 4Q8.675 4 6.337 6.337T4 12q0 1.475.488 2.775T5.85 17.1ZM12 13q-1.475 0-2.488-1.012T8.5 9.5q0-1.475 1.012-2.488T12 6q1.475 0 2.488 1.012T15.5 9.5q0 1.475-1.012 2.488T12 13Zm0 9q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z"
      ></path>
    </svg>
  );
}

const NoteItem = (props) => {
  const auth = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [createdAt, setCreatedAt] = useState(
    new Date(Date.parse(props.createdAt))
  );

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/notes/${props.id}`, {
        headers: {
          Authorization: "Bearer " + auth.token,
        },
      });
      props.onDelete(props.id);
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
            <div className="flex ">
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
      <li className="border rounded-lg shadow-md p-6 mb-4 bg-gray-700 border-white shadow-slate-700 break ">
        <div className="mb-4 whitespace-normal max-w-xl">
          <h2 className="text-lg text-white font-bold mb-2 underline underline-offset-2">
            {props.title}
          </h2>
          <div className="text-white whitespace-pre-line flex flex-wrap ">
            {" "}
            {props.description}
          </div>
        </div>
        <hr></hr>

        <div className=" text-sm text-white mt-3 justify-center flex items-center gap-3 ">
          <MaterialSymbolsAccountCircle className=" w-6 h-6" />
          Jättänyt: {props.name} -
          <div>{createdAt.toLocaleDateString("fi-FI")}</div>
        </div>

        <div className="mt-5 flex items-center justify-end ">
          {auth.userId === props.creator && (
            <Link
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 flex gap-2 items-center"
              to={`/maintenance/${props.id}`}
            >
              <MaterialSymbolsEditSharp />
              Muokkaa
            </Link>
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
