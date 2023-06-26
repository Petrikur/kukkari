import React, { useState, useEffect } from "react";
import axios from "axios";
import backgroundImage from "../assets/bgg.jpg";
import Weather from "../components/Services/Weather";
import LoadingSpinner from "../Ui/LoadingSpinner";

const LandingPage = () => {
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/weather`
        );
        setWeatherData(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchWeatherData();
  }, []);

  if (loading) {
    return (
      <>
        <LoadingSpinner />
      </>
    );
  }

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
        <h1 className="text-6xl text-white mb-10 mt-36 text-center outline-1 drop-shadow-[0_2.2px_1.2px_rgba(0,0,0,0.9)]">
          Tervetuloa mökille
        </h1>
        <div className="text-xl mb-20 text-center text-gray-200 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.9)]">
          Täällä voit tehdä mökkivarauksia ja tehdä muistiinpanoja ja
          kommentoida niitä ja kaikkea muuta kivaa.
        </div>
      </div>
      <hr className="w-4/5 border-gray-400 my-10" />
      <Weather className="mt-8" weatherData={weatherData} />
    </div>
  );
};

export default LandingPage;
