import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import TemperatureDisplay from './components/TemperatureDisplay';

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState("light");
  const [history, setHistory] = useState([]);

  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    setHistory(storedHistory);
  }, []);

  const fetchWeather = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (!city) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
      fetchForecast(city);
      updateHistory(city);
    } catch (err) {
      setError("City not found or API error");
    }
    setLoading(false);
  };

  const fetchForecast = async (city) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      setForecast(response.data.list.slice(0, 5));
    } catch (err) {
      console.error("Forecast error", err);
    }
  };

  const fetchSuggestions = async (input) => {
    if (input.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=3&appid=${API_KEY}`
      );
      setSuggestions(response.data.map((city) => city.name));
    } catch (err) {
      console.error("Suggestion error", err);
    }
  };

  const updateHistory = (city) => {
    let newHistory = [city, ...history.filter((c) => c !== city)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem("weatherHistory", JSON.stringify(newHistory));
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleHistoryClick = (city) => {
    setCity(city);
    fetchWeather();
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-6 transition-all ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <button onClick={toggleTheme} className="absolute top-4 right-4 p-2 bg-gray-200 rounded-lg shadow-md">{theme === "dark" ? "Light Mode" : "Dark Mode"}</button>
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
        <button type="submit" className="bg-blue-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-blue-500 shadow-md">Search</button>
      </form>
      {history.length > 0 && (
        <div className="mt-4 flex gap-2">
          {history.map((item, index) => (
            <button key={index} onClick={() => handleHistoryClick(item)} className="bg-gray-300 px-3 py-2 rounded-lg shadow-md">
              {item}
            </button>
          ))}
        </div>
      )}
      {loading && <motion.p className="mt-4 text-lg" animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }}>Loading...</motion.p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {weather && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 bg-white p-6 rounded-lg shadow-lg text-gray-900 text-center w-full max-w-md">
          <h2 className="text-3xl font-bold">{weather.name}</h2>
          <p className="text-xl capitalize">{weather.weather[0].description}</p>
          <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} className="mx-auto" />
          
          <div className="flex flex-col items-center justify-center">
            <TemperatureDisplay temperature={weather.main.temp} />
            <div className="flex justify-around w-full mt-4">
              <p className="text-lg">Humidity: {weather.main.humidity}%</p>
              <p className="text-lg">Wind Speed: {weather.wind.speed} km/h</p>
            </div>
          </div>
          <button onClick={() => fetchWeather()} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500">Refresh</button>
        </motion.div>
      )}
      {forecast && (
        <div className="mt-6 bg-gray-200 p-6 rounded-lg shadow-lg w-full max-w-md">
          <h3 className="text-2xl font-bold mb-2">5-Day Forecast</h3>
          <div className="flex justify-between">
            {forecast.map((day, index) => (
              <div key={index} className="text-center">
                <p>{new Date(day.dt_txt).toLocaleDateString()}</p>
                <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} alt={day.weather[0].description} />
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