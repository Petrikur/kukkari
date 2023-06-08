import React from "react";

const CheckButton = (props) => {
  return (
    <>
      <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in ">
        <input
          type="checkbox"
          name="toggle"
          id="toggle"
          onChange={props.onChange}
          checked={props.checked}
          disabled={props.toggleButtonDisabled}
          className="toggle-checkbox absolute  block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
        />
        <label
          htmlFor="toggle"
          className={`toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${
            props.toggleButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        ></label>
      </div>
    </>
  );
};

export default CheckButton;
