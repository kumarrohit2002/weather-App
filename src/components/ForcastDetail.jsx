import React from 'react'
import MapLocation from './MapLocation'
import ForcastChart from './ForcastChart'

const ForcastDetail = ({ weather }) => {
    return (
        <div className='w-full'>
            <div className="mt-6 bg-gray-200 p-6 flex flex-col item-center justify-center text-black rounded-lg shadow-lg w-full">
                <h3 className="text-2xl font-bold mb-2">5-Day Forecast</h3>
                <ForcastChart />
            </div>
            <div className="mt-6 bg-gray-200 p-6 flex flex-col item-center justify-center text-black rounded-lg shadow-lg w-full">
                <MapLocation weather={weather} />
            </div>
        </div>
    )
}

export default ForcastDetail