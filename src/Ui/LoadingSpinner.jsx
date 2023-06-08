import React from "react";

const LoadingSpinner = ({color}) => {
  const spinnerColor = color ? `border-${color}` : "border-white";
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div
        className={`${spinnerColor} inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid  border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}
        role="status"
      
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
