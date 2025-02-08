import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import axios from "axios";

const MoodChart = () => {
    const [moodData, setMoodData] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3000/mood-stats")
            .then(response => {
                const formattedData = response.data.map(mood => ({
                    mood: mood._id.charAt(0).toUpperCase() + mood._id.slice(1),
                    count: mood.count
                }));
                setMoodData(formattedData);
            })
            .catch(error => console.error("Error fetching mood data:", error));
    }, []);

    return (
        <div className="p-5">
            <h2 className="text-xl font-semibold text-center mb-4">Mood Analysis</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={moodData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mood" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MoodChart;
