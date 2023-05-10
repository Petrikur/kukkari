import React from "react";
import Weather from "../components/Services/Weather";
import backgroundImage from "../assets/bgg.jpg";


const LandingPage = () => {
  return (
    <div className="h-screen py-[70px] flex flex-col items-center">
      <div
        className="w-full h-2/4"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-6xl font-bold text-white mb-10 mt-20 text-center">
          Tervetuloa kukkariin
        </h1>
        <div className="text-white text-xl font-bold mb-20 text-center">
          Täällä voit tehdä mökkivarauksia ja tehdä muistiinpanoja ja
          kommentoida niitä ja kaikkea muuta kivaa.

          <h2 className="mt-36">Tähän kuva kukkarista</h2>
        </div>
      </div>
      <Weather />
    </div>
  );
};

export default LandingPage;
