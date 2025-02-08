import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import axios from "axios";
import Spinner from "./Spinner";


const MoodChart = () => {
  const [moodData, setMoodData] = useState([]);
  const [chartType, setChartType] = useState("bar"); 
  const [loading, setLoading] = useState(true); 


  useEffect(() => {
    axios
      .get("https://trinetra-tfo7.vercel.app/mood-stats")
      .then((response) => {
        const formattedData = response.data.map((mood) => ({
          mood: mood._id.charAt(0).toUpperCase() + mood._id.slice(1),
          count: mood.count,
        }));
        setMoodData(formattedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching mood data:", error);
        setLoading(false);
      });
  }, []);


  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];


  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <BarChart data={moodData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mood" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #cccccc",
                borderRadius: "5px",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" animationDuration={1000}>
              {moodData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        );
      case "line":
        return (
          <LineChart data={moodData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mood" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #cccccc",
                borderRadius: "5px",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#8884d8"
              strokeWidth={2}
              animationDuration={1000}
            />
          </LineChart>
        );
      case "pie":
        return (
          <PieChart margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <Pie
              data={moodData}
              dataKey="count"
              nameKey="mood"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
              animationDuration={1000}
            >
              {moodData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #cccccc",
                borderRadius: "5px",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend />
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-5 mt-16 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">Mood Analysis</h2>
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setChartType("bar")}
          className={`px-4 py-2 mx-2 rounded-lg transition-all ${
            chartType === "bar"
              ? "bg-teal-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Bar Chart
        </button>
        <button
          onClick={() => setChartType("line")}
          className={`px-4 py-2 mx-2 rounded-lg transition-all ${
            chartType === "line"
              ? "bg-teal-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Line Chart
        </button>
        <button
          onClick={() => setChartType("pie")}
          className={`px-4 py-2 mx-2 rounded-lg transition-all ${
            chartType === "pie"
              ? "bg-teal-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Pie Chart
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner/> 
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          {renderChart()}
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MoodChart;