import React, { useContext } from 'react'
import MapLocation from './MapLocation'
import ForcastChart from './ForcastChart'
import { ApiContext } from '../contexts/ApiContext';

const ForcastDetail = ({ weather }) => {
    const {theme,} = useContext(ApiContext);
    return (
        <div className={`${theme === "dark" ? "bg-gray-900 text-white border rounded-md p-4 mt-2 " : "bg-gray-100 text-black"} w-full`}>

            <div className="p-4 flex flex-col item-center justify-center rounded-lg shadow-lg w-full">
                <h3 className="text-2xl font-bold">5-Day Forecast</h3>
                <ForcastChart />
            </div>

            <div className="mt-6 bg-gray-200 p-4 flex flex-col item-center justify-center text-black rounded-lg shadow-lg w-full">
                <MapLocation weather={weather} />
            </div>

        </div>
    )
}

export default ForcastDetail