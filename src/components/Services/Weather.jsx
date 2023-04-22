import React, { useState, useEffect } from "react";
import axios from "axios";

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/weather");
        setWeatherData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchWeatherData();
  }, []);

  return (
    <div className="container mx-auto text-white">
     <h1 className="flex items-center justify-center py-4 text-3xl ">Vehmersalmi ennuste</h1>
      {weatherData && (
        <div className="flex flex-wrap justify-center gap-4 space-x-2 ">
       
          {weatherData.list
            .filter((forecast, index) => index % 8 === 0)
            .map((forecast) => (
              <div
                key={forecast.dt}
                className="border border-gray-400 rounded p-4 flex flex-col items-center w-40 bg-gray-700 text-center"
              >
                <p className="font-bold">
                 
                  {new Date(forecast.dt_txt).toLocaleDateString("fi-FI", {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                  })}
                </p>
                <img
                className="w-16"
                  src={`http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`}
                  alt="Weather Icon"
                />
                <p>{forecast.weather[0].description}</p>
                <p>{Math.round(forecast.main.temp)}°C</p>
                <p>Tuuli: {Math.round(forecast.wind.speed)} m/s</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Weather;
