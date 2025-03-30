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
    <div className={`flex flex-col items-center justify-center 
      ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
    
      <div className="flex flex-col items-center justify-center 
        min-h-screen p-4 sm:p-6 max-w-[95%] sm:max-w-[800px] w-full transition-all">
    
        {/* Theme Toggle */}
        <label className="inline-flex items-center me-5 cursor-pointer">
          <input type="checkbox" className="sr-only peer" checked={theme === "dark"} onChange={toggleTheme} />
          <div className="relative w-10 h-5 bg-gray-300 rounded-full 
            peer-checked:bg-red-600 after:absolute after:top-0.5 
            after:left-[2px] after:w-4 after:h-4 after:bg-white 
            after:rounded-full after:transition-all peer-checked:after:translate-x-5"></div>
          <span className="ms-2 text-sm font-medium">{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
        </label>
    
        {/* Heading */}
        <h1 className="text-2xl sm:text-4xl font-bold text-center mb-4">Weather Dashboard</h1>
    
        {/* Search Form */}
        <form className="flex w-full " onSubmit={handleSearch}>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                fetchSuggestions(e.target.value);
              }}
              className="w-full p-3 bg-gray-200 rounded-lg text-black shadow-md outline-none"
            />
            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <ul className="absolute w-full bg-white border border-gray-300 
                rounded-lg shadow-md mt-1 max-h-40 overflow-auto text-sm">
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
            className="bg-blue-600 text-white px-5 py-3 rounded-lg font-bold 
            hover:bg-blue-500 shadow-md w-full sm:w-auto">
            Search
          </button>
        </form>
    
        {/* Search History */}
        {history.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {history.map((item, index) => (
              <button
                key={index}
                onClick={() => handleHistoryClick(item)}
                className="bg-gray-300 text-black px-3 py-2 rounded-lg shadow-md text-sm"
              >
                {item}
              </button>
            ))}
          </div>
        )}
    
        {/* Loading Indicator */}
        {loading && (
          <motion.p
            className="mt-4 text-lg flex justify-center"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <img className="w-16 h-16 animate-spin" src="https://www.svgrepo.com/show/474682/loading.svg" alt="Loading icon" />
          </motion.p>
        )}
    
        {/* Error Message */}
        {error && (
          <div className="text-center">
            <NotFound />
            <p className="mt-4 text-red-500">{error}</p>
          </div>
        )}
    
        {/* Weather Details */}
        {weather && <WeatherDetails weather={weather} />}
    
        {/* Forecast Details */}
        {forecast && <ForcastDetail weather={weather} />}
      </div>
    </div>
    
  );
};

export default WeatherApp;
