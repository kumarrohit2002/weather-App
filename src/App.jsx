import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ApiContext } from "./contexts/ApiContext";
import TemperatureDisplay from "./components/TemperatureDisplay";
import humidity from "./assets/image.png";
import wind from "./assets/wind.jpg";

import NotFound from "./components/NotFound";

const WeatherApp = () => {
  const {
    weather,
    forecast,
    loading,
    error,
    city,
    setCity,
    setSuggestions,
    history,
    fetchWeather,
    setTheme,
    suggestions,
    fetchSuggestions,
    theme,
  } = useContext(ApiContext);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Function to fetch weather based on user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const API_KEY =import.meta.env.VITE_API_KEY;
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

          try {
            const response = await axios.get(url);
            setCity(response.data.name); 
            fetchWeather();
          } catch (err) {
            console.error("Error fetching weather:", err);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const handleHistoryClick = (city) => {
    setCity(city);
    fetchWeather();
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen p-6 transition-all ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 bg-gray-200 rounded-lg shadow-md"
      >
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </button>
      <h1 className="text-4xl font-bold mb-6">Weather Dashboard</h1>
      <form className="flex gap-2 w-full max-w-md" onSubmit={fetchWeather}>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              fetchSuggestions(e.target.value);
            }}
            className="w-full p-3 bg-gray-100 rounded-lg text-black shadow-md outline-none"
          />
          {suggestions.length > 0 && (
            <ul className="absolute w-full bg-white border border-gray-300 rounded-lg shadow-md mt-1 max-h-40 overflow-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setCity(suggestion);
                    setSuggestions([]);
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-blue-500 shadow-md"
        >
          Search
        </button>
      </form>
      {history.length > 0 && (
        <div className="mt-4 flex gap-2">
          {history.map((item, index) => (
            <button
              key={index}
              onClick={() => handleHistoryClick(item)}
              className="bg-gray-300 px-3 py-2 rounded-lg shadow-md"
            >
              {item}
            </button>
          ))}
        </div>
      )}
      {loading && (
        <motion.p
          className="mt-4 text-lg"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <img
            className="w-20 h-20 animate-spin"
            src="https://www.svgrepo.com/show/474682/loading.svg"
            alt="Loading icon"
          />
        </motion.p>
      )}
      {error && <div>
          <NotFound/>
          <p className="mt-4 text-red-500">{error}</p>
        </div>}
      {weather && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 bg-white p-6 rounded-lg shadow-lg text-gray-900 text-center w-full max-w-md"
        >
          <h2 className="text-3xl font-bold">{weather.name}</h2>
          <p className="text-xl capitalize">{weather.weather[0].description}</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
            className="mx-auto"
          />

          <div className="flex flex-col items-center justify-center">
            <TemperatureDisplay temperature={weather.main.temp} />
            <div className="flex justify-around w-full mt-4">
              <p className="text-lg">
                <img className="w-10" src={humidity} />
                Humidity: {weather.main.humidity}%
              </p>
              <p className="text-lg">
                <img className="w-10" src={wind} />
                Wind Speed: {weather.wind.speed} km/h
              </p>
            </div>
          </div>
          <button
            onClick={() => fetchWeather()}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500"
          >
            Refresh
          </button>
        </motion.div>
      )}
      {forecast && (
        <div className="mt-6 bg-gray-200 p-6 rounded-lg shadow-lg w-full max-w-md">
          <h3 className="text-2xl font-bold mb-2">5-Day Forecast</h3>
          <div className="flex justify-between">
            {forecast.map((day, index) => (
              <div key={index} className="text-center">
                <p>{new Date(day.dt_txt).toLocaleDateString()}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                  alt={day.weather[0].description}
                />
                <p>{day.main.temp}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
