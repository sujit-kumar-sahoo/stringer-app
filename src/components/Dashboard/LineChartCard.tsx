"use client";
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface LineChartCardProps {
  sampleData: { name: string; value: number; value2: number }[];
}

const LineChartCard: React.FC<LineChartCardProps> = ({ sampleData }) => {
  const [lineVisibility, setLineVisibility] = useState({
    value: true,
    value2: true,
  });

  const handleLegendClick = (dataKey: string) => {
    setLineVisibility((prev) => ({ ...prev, [dataKey]: !prev[dataKey as keyof typeof prev] }));
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-4">
      <h2 className="text-lg font-semibold mb-4">Line Chart</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={sampleData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend onClick={(e) => handleLegendClick(e.dataKey)} />
          {lineVisibility.value && <Line type="monotone" dataKey="value" stroke="#8884d8" />}
          {lineVisibility.value2 && <Line type="monotone" dataKey="value2" stroke="#82ca9d" />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartCard;
