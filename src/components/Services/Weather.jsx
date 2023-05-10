import React, { useState, useEffect } from "react";
import axios from "axios";
import { TiThermometer } from "react-icons/ti";
import { BiWind } from "react-icons/bi";
const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}`+ "/weather");
        setWeatherData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchWeatherData();
  }, []);

  return (
    <div className="container mx-auto text-white bg-gradient-to-b ">
      <h1 className="flex items-center justify-center py-6 text-4xl font-bold text-white text-center">
        Vehmersalmi ennuste
      </h1>
      {weatherData && (
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {weatherData.list
            .filter((forecast, index) => index % 8 === 0)
            .map((forecast) => (
              <div
                key={forecast.dt}
                className="border border-gray-400 rounded-lg p-6 flex flex-col items-center w-52 bg-gray-900 shadow-lg text-center"
              >
                <p className="font-bold text-white">
                  {new Date(forecast.dt_txt).toLocaleDateString("fi-FI", {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                  })}
                </p>
                <img
                  className="w-16 h-16"
                  src={`http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`}
                  alt="Weather Icon"
                />
                <p className="text-white mb-2">
                  {forecast.weather[0].description}
                </p>
                <div className="flex items-center mb-2">
                  <TiThermometer className="mr-2 text-red-500" />
                  <p className="text-xl font-bold text-green-700">
                    {Math.round(forecast.main.temp)}°C
                  </p>
                </div>

                <div className="text-white flex justify-center items-center ">
                  <div>
                    <BiWind className="mr-2 text-blue-500" />
                  </div>
                  <div>{Math.round(forecast.wind.speed)} m/s</div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Weather;
