import React, { useContext, useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import { MdClose, MdDelete, MdInfo, MdWarning } from "react-icons/md";
import Backdrop from "./BackDrop";
import ReactDOM from "react-dom";
import { AuthContext } from "../components/context/authContext";

const ModalOverlay = (props) => {
  const isInfoModal = props.modalType === "info";
  const auth = useContext(AuthContext);
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  useEffect(() => {
    if (
      props.selectedEvent?.creator ||
      props.noteCreator ||
      props.type === "comment"
    ) {
      if (props.type === "reservation" && props.selectedEvent) {
        setShowDeleteButton(auth.userId === props.selectedEvent.creator);
      } else if (props.type === "note" && props.noteCreator) {
        setShowDeleteButton(auth.userId === props.noteCreator);
      } else if (props.type === "comment") {
        setShowDeleteButton(true);
      }
    }
  }, [props]);

  const content = (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 w-[95%] -translate-y-1/2 z-50 sm:w-96 md:w-120 ">
      <div className="relative bg-gray-900 border-gray-200 border-2 rounded-lg  p-5 ">
        <header className="p-6 border-b flex justify-between items-center text-white">
          <div className="text-center">
            {!isInfoModal ? <MdWarning color={"red"} size={36} /> : <MdInfo  color={"yellow"} size={36}/>  }
          </div>
          <h1 className="text-lg font-semibold">{props.header}</h1>
          <button id="modalCloseButton" onClick={props.onCancel}>
            <MdClose size={24} />
          </button>
        </header>
        <form
          onSubmit={
            props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
          }
        >
          <div className="p-4 overflow-y-auto max-h-72">{props.children}</div>
          <footer className="p-4 border-t flex justify-end">
            <button
              className="text-gray-500 mr-2"
              id="modalCancelButton"
              onClick={props.onCancel}
            >
              Peruuta
            </button>
            {showDeleteButton && (
              <button
                className="text-red-500 font-semibold flex items-center"
                id="modalDeleteButton"
                onClick={props.onDelete}
              >
                <MdDelete size={20} className="mr-1" />
                Poista
              </button>
            )}
          </footer>
        </form>
      </div>
    </div>
  );
  return ReactDOM.createPortal(content, document.getElementById("modalhook"));
};

const Modal = (props) => {
  return (
    <React.Fragment>
      {props.show && <Backdrop onClick={props.onClose} />}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={{ enter: 0, exit: 50 }}
        classNames="modal"
      >
        <ModalOverlay {...props} />
      </CSSTransition>
    </React.Fragment>
  );
};

export default Modal;
