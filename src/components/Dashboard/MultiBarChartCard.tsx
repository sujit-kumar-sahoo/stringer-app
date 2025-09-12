"use client";
import React, { useState } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface MultiBarChartCardProps {
  sampleData: { name: string; value: number; value2: number }[];
}

const MultiBarChartCard: React.FC<MultiBarChartCardProps> = ({ sampleData }) => {
  const [visibility, setVisibility] = useState({
    value: true,
    value2: true,
  });

  // const handleLegendClick = (dataKey: string) => {
  //   setVisibility((prev) => ({ ...prev, [dataKey]: !prev[dataKey as keyof typeof prev] }));
  // };

  return (
    <div className="bg-white shadow-md rounded-2xl p-4">
      <h2 className="text-lg font-semibold mb-4">Multi Bar & Line Chart</h2>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={sampleData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend  />
          {visibility.value && <Bar dataKey="value" fill="#8884d8" />}
          {visibility.value2 && <Line type="monotone" dataKey="value2" stroke="#82ca9d" />}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MultiBarChartCard;
