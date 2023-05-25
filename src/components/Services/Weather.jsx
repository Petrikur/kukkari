import React, { useState, useEffect } from "react";
import axios from "axios";
import { TiThermometer } from "react-icons/ti";
import { BiWind, BiCloudRain } from "react-icons/bi";

const Weather = ({weatherData}) => {
  // const [weatherData, setWeatherData] = useState(null);

  // useEffect(() => {
  //   const fetchWeatherData = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${import.meta.env.VITE_SERVER_URL}/weather`
  //       );
  //       setWeatherData(response.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchWeatherData();
  // }, []);

  const getTemperatureColorClass = (temperature) => {
    if (temperature > 22) {
      return "text-red-500";
    } else if (temperature > 10) {
      return "text-green-500"; 
    } else {
      return "text-blue-500"; 
    }
  };

  return (
    <div className="container mx-auto text-white bg-gradient-to-b mb-24">
      <h1 className="flex items-center justify-center pb-2 text-3xl text-white text-center">
        Vehmersalmi ennuste
      </h1>
      {weatherData && (
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {weatherData.daily.slice(0, 5).map((forecast) => (
            <div
              key={forecast.dt}
              className="border border-gray-400 rounded-lg flex flex-col items-center w-52 bg-gray-900 shadow-lg text-center"
            >
              <div className="bg-emerald-600 w-full py-2 mb-2 rounded-t-lg">
                <p className="font-medium text-white">
                  {new Date(forecast.dt * 1000).toLocaleDateString("fi-FI", {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>

              <div className="w-full flex items-center justify-center flex-col py-4 px-6">
                {" "}
                <img
                  className="w-16 h-16"
                  src={`http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`}
                  alt="Weather Icon"
                />
                <div className="flex items-center mb-2 px-4">
                  <TiThermometer  size={20} className="mr-2 text-red-500" />
                  <p className={`text-xl font-bold ${getTemperatureColorClass(
                  Math.round(forecast.temp.max)
                )}`}>
                  {Math.round(forecast.temp.max)}°C
                </p>
                </div>{" "}
                <p className="text-white mb-2">
                  {forecast.weather[0].description}
                </p>
                <div className="text-white flex justify-center items-center px-4">
                  <div>
                    <BiWind size={20} className="mr-2 text-blue-500" />
                  </div>
                  <div>{Math.round(forecast.wind_speed)} m/s</div>
                </div>
                {forecast.rain && (
                  <div className="text-white flex justify-center items-center px-4 mt-2">
                    {" "}
                    <div className="">
                      <BiCloudRain size={20} className="mr-2 text-blue-500" />
                    </div>
                    <div>{forecast.rain.toFixed(1)} mm</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Weather;
