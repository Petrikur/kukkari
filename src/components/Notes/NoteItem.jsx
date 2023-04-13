import React, { useState, useContext, useEffect, useRef } from "react";
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

export function LucideTrash2(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="#888888"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 5v6m4-6v6"
      ></path>
    </svg>
  );
}

const NoteItem = (props) => {
  const auth = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(props.comments);
  const listItemRef = useRef(null); // create a ref for the list item

  console.log(props);
  // format createdAt field
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
      setComments(comments.filter((comment) => comment.noteId !== props.id));
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setShowConfirmModal(false);
    }
  };

  const handleAddCommentClick = () => {
    setShowCommentInput(true);
    
  };

  // Scroll to show buttons if comment input is open
  if(showCommentInput){
    setTimeout(() => {
      listItemRef.current.scrollIntoView({ behavior: 'smooth', block:"end" });
    }, 100);
  }

  const handleCommentCancel = () => {
    setShowCommentInput(false);
  };

  // Delete note
  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/comments",
        {
          content: comment,
          author: auth.userId,
          noteId: props.id,
          authorName: auth.name,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
        }
      );
      console.log(response.data);
      setIsLoading(false);
      setShowCommentInput(false);
      setComment("");
      setComments([...comments, response.data]);
      navigate("/maintenance");
    } catch (err) {
      console.log(err);
    }
  };

  // Delete comment
  const handleCommentDelete = async (id) => {
    try {
      setIsLoading(true);
      await axios.delete(`http://localhost:5000/api/comments/${id}`, {
        headers: {
          Authorization: "Bearer " + auth.token,
        },
      });
      // setComments(comments.filter((comment) => comment.noteId !== props.id));
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== id)
      );
      console.log(comments);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
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
      <li ref={listItemRef} className="border rounded-lg shadow-md p-6 mb-4 bg-gray-700 border-white shadow-slate-700 break overflow-auto">
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

        {/* Comments  */}
        <div
          key={props.id}
          className="shadow-md p-6 mb-4 bg-gray-700 shadow-slate-700 break "
        >
          {comments.map((comment, index) => {
            {/*  format date to finnish format */}
            const formattedDate = new Date(comment.createdAt).toLocaleString(
              "fi-FI",
              {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              }
            );
            return (
              <div
                key={index}
                className="mb-4 flex items-center justify-between"
              >
                <div className="flex-grow max-w-full">
                  <div className="text-white font-sm mb-1  text-md">
                    {comment.authorName} --- {formattedDate}
                  </div>

                  <div className="mr-4 bg-gray-100 shadow-md p-4 rounded-lg max-w-xl">
                    <p className="text-gray-600 text-sm whitespace-pre-line">
                      {comment.content}
                    </p>
                  </div>
                </div>

                {/* If person made the comment, add delete button */}
                {comment.author === auth.userId && (
                  <button
                    onClick={() => {
                      handleCommentDelete(comment.id);
                    }}
                    className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md"
                  >
                    <LucideTrash2 />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* If comment input should be open, show input, otherwise show other buttons  */}
        {showCommentInput ? (
          <form onSubmit={handleCommentSubmit}>
            <textarea
              className="w-full h-24 p-2 mt-4 bg-gray-800 text-white rounded-md border  border-gray-600 "
              placeholder="Kirjoita kommentti..."
              onChange={(event) => {
                setComment(event.target.value);
              }}
            ></textarea>
            <div className="mt-2 flex justify-end gap-2">
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 ml-2"
                type="submit"
              >
                Lähetä
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                type="button"
                onClick={handleCommentCancel}
              >
                Peruuta
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-5 flex flex-col items-center justify-between sm:flex-row gap-4 ">
            <button 
              onClick={handleAddCommentClick}
              className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 ml-2"
            >
              Lisää kommentti
            </button>

            <div  className="flex">
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
          </div>
        )}
      </li>
    </React.Fragment>
  );
};

export default NoteItem;
