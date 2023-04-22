import React, { useEffect, useState } from "react";
import axios from "axios";
import Weather from "../components/Services/Weather";
import backgroundImage from "../assets/bgg.jpg";
import LoadingSpinner from "../Ui/LoadingSpinner";

const LandingPage = () => {
  return (
    <div
      className="h-screen flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div>
        <h1 className="text-6xl font-bold text-white mb-10 text-center">
          Tervetuloa kukkariin
        </h1>
        <div className="text-white text-xl font-bold mb-20">
          Täällä voit tehdä mökkivarauksia ja tehdä muistiinpanoja ja
          kommentoida niitä ja kaikkea muuta kivaa.
        </div>
      </div>
      <Weather />
    </div>
  );
};

export default LandingPage;
