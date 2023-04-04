import React, { useState, useContext } from "react";
import { AuthContext } from "../context/authContext";

const NoteItem = (props) => {
  const auth = useContext(AuthContext);

  return (
    <React.Fragment>
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
                EDIT
              </button>
            )}

            {auth.userId === props.creator && (
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 ml-2"
                danger
            
              >
                DELETE
              </button>
            )}
          </div>
      
      </li>
    </React.Fragment>
  );
};

export default NoteItem;
