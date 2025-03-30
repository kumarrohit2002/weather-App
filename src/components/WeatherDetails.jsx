import React from 'react'
import { motion } from "framer-motion";
import TemperatureDisplay from './TemperatureDisplay';
import humidity from "../assets/image.png";
import wind from '../assets/Wind.jpg'

const WeatherDetails = ({weather}) => {
    const cool='bg-linear-to-r/shorter from-indigo-500 to-teal-400';
    const hot='bg-linear-to-r/longer from-indigo-700 to-teal-200';
  return (
    <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={` ${weather.main.temp>25?hot:cool}  mt-6 bg-white p-6 rounded-lg shadow-lg text-gray-900 text-center w-full `}
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

  )
}

export default WeatherDetails