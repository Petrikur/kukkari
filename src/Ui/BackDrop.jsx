import React from "react";
import { createPortal } from "react-dom";

const Backdrop = (props) => {
  return createPortal(
    <div
      className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-75 z-22"
      onClick={props.onClick}
    ></div>,
    document.getElementById("backdrophook")
  );
};

export default Backdrop;
