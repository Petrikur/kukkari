import React from "react";
import Weather from "../components/Services/Weather";
import backgroundImage from "../assets/bgg.jpg";

const LandingPage = () => {
  return (
    <div className="h-screen flex flex-col items-center">
      <div
        className="w-full h-2/4 flex flex-col justify-center items-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-6xl text-white mb-10 mt-40 text-center outline-1 drop-shadow-[0_2.2px_1.2px_rgba(0,0,0,0.9)]">
          Tervetuloa kukkariin
        </h1>
        <div className="text-xl  mb-20 text-center text-gray-200 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.9)]">
          Täällä voit tehdä mökkivarauksia ja tehdä muistiinpanoja ja
          kommentoida niitä ja kaikkea muuta kivaa.
        </div>
      </div>
      <hr className="w-4/5 border-gray-400 my-10" />
      <Weather />
    </div>
  );
};

export default LandingPage;
