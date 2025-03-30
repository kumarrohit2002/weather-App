import React, { useContext } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { ApiContext } from "../contexts/ApiContext";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WeatherChart = () => {
  const { forecast } = useContext(ApiContext);

  if (!forecast || forecast.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-lg text-gray-500">No forecast data available</p>
      </div>
    );
  }

  // Generate labels with "Month Day (Weekday)" format (e.g., May 1 (Mon), May 2 (Tue))
  const labels = forecast.map((data) => {
    const date = new Date(data.dt_txt);
    const monthDay = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
    const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
    return `${monthDay} (${weekday})`; // Example: "May 1 (Mon)"
  });

  const temperatures = forecast.map((data) => data.main.temp);

  const data = {
    labels,
    datasets: [
      {
        label: "Temperature (°C)",
        data: temperatures,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: { display: true },
      title: { display: true, text: "5-Day Temperature Forecast", font: { size: 18 } },
    },
    scales: {
      x: {
        ticks: { autoSkip: false, maxTicksLimit: 6 },
      },
    },
  };

  return (
    <div className="flex justify-center items-center mt-6 mb-4 w-full">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6">
        {/* <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">📊 Temperature Forecast</h2> */}
        <div className="h-[300px] w-full"> 
          <Line data={data} options={options} height={400} />
        </div>
      </div>
    </div>
  );
};

export default WeatherChart;
