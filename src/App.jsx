import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ApiContext } from "./contexts/ApiContext";
import NotFound from "./components/NotFound";
import WeatherDetails from "./components/WeatherDetails";
import ForcastDetail from "./components/ForcastDetail";

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

  const cool = "bg-gradient-to-r from-indigo-500 to-teal-400";
  const hot = "bg-gradient-to-r from-indigo-700 to-teal-200";

  // Fetch weather using user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const API_KEY = import.meta.env.VITE_API_KEY;
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

          try {
            const response = await axios.get(url);
            setCity(response.data.name);
            fetchWeather(response.data.name); // Fetch weather for detected city
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

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather(city);
  };

  const handleHistoryClick = (city) => {
    setCity(city);
    fetchWeather(city);
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen p-6 transition-all ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* Theme Toggle */}
      <label className="inline-flex items-center me-5 cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={theme === "dark"}
          onChange={toggleTheme}
        />
        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600 dark:peer-checked:bg-red-600"></div>
        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          {theme === "dark" ? "Dark Mode" : "Light Mode"}
        </span>
      </label>

      {/* Heading */}
      <h1 className="text-4xl font-bold mb-6">Weather Dashboard</h1>

      {/* Search Form */}
      <form className="flex gap-2 w-full max-w-md" onSubmit={handleSearch}>
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
          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <ul className="absolute w-full bg-white border border-gray-300 rounded-lg shadow-md mt-1 max-h-40 overflow-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setCity(suggestion);
                    setSuggestions([]);
                    fetchWeather(suggestion);
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

      {/* Search History */}
      {history.length > 0 && (
        <div className="mt-4 flex gap-2">
          {history.map((item, index) => (
            <button
              key={index}
              onClick={() => handleHistoryClick(item)}
              className="bg-gray-300 text-black px-3 py-2 rounded-lg shadow-md"
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {/* Loading Indicator */}
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

      {/* Error Message */}
      {error && (
        <div>
          <NotFound />
          <p className="mt-4 text-red-500">{error}</p>
        </div>
      )}

      {/* Weather Details */}
      {weather && <WeatherDetails weather={weather} />}

      {/* Forecast Details */}
      {forecast && <ForcastDetail weather={weather} />}
    </div>
  );
};

export default WeatherApp;
