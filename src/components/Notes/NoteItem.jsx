// NoteItem.jsx
import React, { useState, useContext, useRef, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import Modal from "../../Ui/Modal";
import axios from "axios";
import LoadingSpinner from "../../Ui/LoadingSpinner";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";



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
  const [showNoteConfirmModal, setShowNoteConfirmModal] = useState(false);
  const [showCommentConfirmModal, setShowCommentConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(props.comments);
  const listItemRef = useRef(null); // create a ref for the list item
  const [createdAt, setCreatedAt] = useState(
    new Date(Date.parse(props.createdAt))
  );

  useEffect(() => {
    props.socket.on("newComment", handleNewComment);
    props.socket.on("deleteComment", handleDeleteComment);

    return () => {
      props.socket.off("newComment", handleNewComment);
      props.socket.off("deleteComment", handleDeleteComment);
    };
  }, []);

  //  Socket listener functions
  const handleNewComment = (newComment) => {
    if (newComment && newComment.noteId === props.noteId) {
      setComments((prevComments) => [...prevComments, newComment]);
    }
  };

  const handleDeleteComment = ({ id }) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment._id !== id)
    );
  };

  const showDeleteWarningHandler = () => {
    setShowNoteConfirmModal(true);
  };

  const deleteCommentConfirm = (comment) => {
    setComment(comment._id);
    setShowCommentConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowCommentConfirmModal(false);
    setShowNoteConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setIsLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}` + `/notes/${props.id}`,
        {
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        }
      );
      setComments(comments.filter((comment) => comment.noteId !== props._id));
      toast.success("Muistiinpano poistettu!");
    } catch (err) {
      const errorMessage = err.response.data.message;
      toast.warn(errorMessage);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCommentClick = () => {
    setShowCommentInput(true);
  };

  if (showCommentInput) {
    setTimeout(() => {
      listItemRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  }

  const handleCommentCancel = () => {
    setShowCommentInput(false);
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    const newComment = {
      content: comment,
      author: auth.userId,
      noteId: props.noteId,
      authorName: auth.name,
    };

    if (comment.trim() === "") {
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}` + "/comments",
        newComment,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
        }
      );
      setShowCommentInput(false);
      toast.success("Kommentti luotu!");
    } catch (err) {
      const errorMessage = err.response.data.message;
      toast.dismiss();
      toast.warn(errorMessage);
      console.log(err);
      console.log(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentDelete = async (id) => {
    try {
      setIsLoading(true);
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}` + `/comments/${id}`,
        {
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        }
      );
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== id)
      );
      toast.success("Kommentti poistettu!");
      setComment("");
    } catch (err) {
      const errorMessage = err.response.data.message;
      toast.warn(errorMessage);
      console.log(errorMessage);
    } finally {
      setIsLoading(false);
      setShowCommentConfirmModal(false);
    }
  };

  return (
    <React.Fragment>
      {/* Confirm deletion modal  */}
      {isLoading && <LoadingSpinner />}
      <Modal
        show={showNoteConfirmModal}
        onClose={cancelDeleteHandler}
        header="Oletko varma?"
        onCancel={cancelDeleteHandler}
        onDelete={confirmDeleteHandler}
        type="note"
        creator={props.creator}
         modalType={"delete"}
      >
        <p className="text-white">
          Oletko varma että haluat poistaa muistiinpanon?
        </p>
      </Modal>

      {/* Comment delete confirm modal */}
      <Modal
        show={showCommentConfirmModal}
        onClose={cancelDeleteHandler}
        header="Poista kommentti?"
        onCancel={cancelDeleteHandler}
        onDelete={() => {
          handleCommentDelete(comment);
        }}
        creator={props.creator}
        type={"comment"}
           modalType={"delete"}
      >
        <p className="text-white">Vahvista kommentin poisto.</p>
      </Modal>

      <li
        ref={listItemRef}
        className="border rounded-lg shadow-md md:w-1/2 lg:w-1/2 xl:w-1/4 sm:w-2/3 w-full p-6 mb-4 bg-gray-700 border-white shadow-slate-700 "
      >
        <div className="mb-4 whitespace-normal max-w-xl">
          <div className="flex flex-row items-center justify-between mb-10">
            <div className="text-lg text-white font-bold underline underline-offset-4 flex-wrap">
              {props.title}
            </div>

            <div className="text-sm text-white flex items-center gap-3">
              <MaterialSymbolsAccountCircle className=" w-6 h-6" />
              {props.name}
              <div>
                {createdAt.toLocaleString("fi-FI", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </div>
            </div>
          </div>

          <div className="text-white whitespace-pre-line flex flex-wrap ">
            {" "}
            {props.description}
          </div>
        </div>
        <hr></hr>

        {/* Comments  */}
        <div
          key={props._id}
          className="p-6 mb-4 bg-gray-700 rounded-md shadow-md"
        >
          {comments.map((comment, index) => {
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
                key={`${comment._id}-${index}`}
                className="mb-4 flex items-center"
              >
                <div className="flex-grow">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-gray-800 text-sm leading-snug whitespace-pre-line">
                      {comment.content}
                    </p>
                    <div className="text-gray-500 text-xs text-right mt-2">
                      <span className="text-sm">{comment.authorName}</span> -{" "}
                      {formattedDate}
                    </div>
                  </div>
                </div>

                {comment.author === auth.userId && (
                  <div className="ml-4">
                    <button
                      onClick={() => {
                        deleteCommentConfirm(comment);
                      }}
                      className={`flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-sm w-8 h-8
               
              `}
                    >
                      <LucideTrash2 />
                    </button>
                  </div>
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
              required
              onChange={(event) => {
                setComment(event.target.value);
              }}
            ></textarea>
            <div className="mt-2 flex justify-end gap-2">
              {!isLoading && (
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 ml-2"
                  type="submit"
                >
                  Lähetä
                </button>
              )}
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
          <div className="mt-5 flex flex-col items-center justify-between md:flex-row gap-4 xl:flex-col 2xl:flex-row ">
            <button
              onClick={handleAddCommentClick}
              className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 ml-2"
            >
              Lisää kommentti
            </button>

            <div className="flex">
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
