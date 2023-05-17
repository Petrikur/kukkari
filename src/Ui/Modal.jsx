import React from "react";
import { CSSTransition } from "react-transition-group";
import Backdrop from "./BackDrop";
import ReactDOM from "react-dom";

const ModalOverlay = (props) => {
  const content = (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 sm:w-96 md:w-120 ">
      <div className="relative bg-white rounded-lg ">
        <header className="p-6 border-b">
          <h1 className="text-lg font-semibold">{props.header}</h1>
        </header>
        <form
          onSubmit={
            props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
          }
        >
          <div className="p-4">{props.children}</div>
          <footer className="p-4 border-t">{props.footer}</footer>
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
