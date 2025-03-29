import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState("light");
  const [history, setHistory] = useState([]);

  const API_KEY =import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    setHistory(storedHistory);
  }, []);

  const fetchWeather = async (e) => {
    e.preventDefault();
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

  const updateHistory = (city) => {
    let newHistory = [city, ...history.filter((c) => c !== city)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem("weatherHistory", JSON.stringify(newHistory));
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-6 transition-all ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <button onClick={toggleTheme} className="absolute top-4 right-4 p-2 bg-gray-200 rounded-lg shadow-md">{theme === "dark" ? "Light Mode" : "Dark Mode"}</button>
      <h1 className="text-4xl font-bold mb-6">Weather Dashboard</h1>
      <form className="flex gap-2 w-full max-w-md" onSubmit={fetchWeather}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-3 rounded-lg text-black shadow-md outline-none"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-blue-500 shadow-md">Search</button>
      </form>
      {loading && <motion.p className="mt-4 text-lg" animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }}>Loading...</motion.p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {weather && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 bg-white p-6 rounded-lg shadow-lg text-gray-900 text-center w-full max-w-md">
          <h2 className="text-3xl font-bold">{weather.name}</h2>
          <p className="text-xl capitalize">{weather.weather[0].description}</p>
          <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} className="mx-auto" />
          <p className="text-4xl font-semibold">{weather.main.temp}°C</p>
          <p className="text-lg">Humidity: {weather.main.humidity}%</p>
          <p className="text-lg">Wind Speed: {weather.wind.speed} km/h</p>
          <button onClick={() => fetchWeather({ preventDefault: () => {} })} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500">Refresh</button>
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
      {history.length > 0 && (
        <div className="mt-6 w-full max-w-md text-center">
          <h3 className="text-xl font-bold">Recent Searches</h3>
          <ul className="flex gap-2 justify-center mt-2">
            {history.map((h, index) => (
              <li key={index} className="cursor-pointer bg-gray-300 px-4 py-2 rounded-lg" onClick={() => setCity(h)}>{h}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
