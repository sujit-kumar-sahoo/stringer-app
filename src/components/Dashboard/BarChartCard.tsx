"use client";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface BarChartCardProps {
  sampleData: { name: string; value: number; }[];
}

const BarChartCard: React.FC<BarChartCardProps> = ({ sampleData }) => {
  const [barVisibility, setBarVisibility] = useState({
    value: true,
    value2: true,
  });

  const handleLegendClick = (dataKey: string) => {
    setBarVisibility((prev) => ({ ...prev, [dataKey]: !prev[dataKey as keyof typeof prev] }));
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-4">
      <h2 className="text-lg font-semibold mb-4">Bar Chart</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={sampleData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend onClick={(e) => handleLegendClick(e.dataKey)} />
          {barVisibility.value && <Bar dataKey="value" fill="#8884d8" />}
          {barVisibility.value2 && <Bar dataKey="value2" fill="#82ca9d" />}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartCard;
