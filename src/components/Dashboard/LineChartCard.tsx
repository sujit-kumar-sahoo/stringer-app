// LineChartCard.tsx
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
  LegendPayload,
} from "recharts";
import { Download, Maximize, Minimize } from "lucide-react";


interface LineChartCardProps {
  sampleData: any[];
  headingText: string;
  onApplyFilter: (dateType: string) => void;
}

// ✅ Helper: Convert data to CSV and trigger download
const downloadCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) return;
  const header = Object.keys(data[0]).join(",");
  const rows = data.map((row) => Object.values(row).join(","));
  const csvContent = [header, ...rows].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const LineChartCard: React.FC<LineChartCardProps> = ({
  sampleData,
  headingText,
  onApplyFilter,
}) => {
  const [dateType, setDateType] = useState("date");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Transform priorityDataCount into flat format for recharts
  const chartData = sampleData.map((item) => {
    const mergedValues = item.value.reduce(
      (acc:any, obj:any) => ({ ...acc, ...obj }),
      {}
    );
    return { name: item.date_name, ...mergedValues };
  });

  // Extract dynamic keys (priority types)
  const keys = Object.keys(chartData[0] || {}).filter((k) => k !== "name");

  // Initial visibility (all true)
  const [lineVisibility, setLineVisibility] = useState<Record<string, boolean>>(
    () =>
      keys.reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {} as Record<string, boolean>)
  );

  // Toggle visibility
  const handleLegendClick = (dataKey?: string) => {
    if (!dataKey) return;
    setLineVisibility((prev) => ({
      ...prev,
      [dataKey]: !prev[dataKey],
    }));
  };

  // Chart UI
  const ChartUI = (
    <ResponsiveContainer width="100%" height={isFullscreen ? 500 : 300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend onClick={(e: LegendPayload) => handleLegendClick(e.value)} />
        {keys.map(
          (key, index) =>
            lineVisibility[key] && (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={`hsl(${(index * 137.508) % 360},70%,50%)`}
              />
            )
        )}
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <>
      <div className="bg-white shadow-md rounded-2xl p-4">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{headingText}</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => onApplyFilter("date")}
              className="p-2 rounded bg-gray-100"
            >
              Date
            </button>
            <button
              onClick={() => onApplyFilter("week")}
              className="p-2 rounded bg-gray-100"
            >
              Week
            </button>
            <button
              onClick={() => onApplyFilter("month")}
              className="p-2 rounded bg-gray-100"
            >
              Month
            </button>
            <button
              onClick={() => downloadCSV(chartData, `${headingText}.csv`)}
              className="p-2 rounded hover:bg-gray-100"
            >
              <Download size={18} />
            </button>
            <button
              onClick={() => setIsFullscreen(true)}
              className="p-2 rounded hover:bg-gray-100"
            >
              <Maximize size={18} />
            </button>
          </div>
        </div>

        {ChartUI}
      </div>

      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="w-full h-[85%] relative">
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-3 z-[100] right-3 p-2 rounded bg-gray-200"
            >
              <Minimize size={20} />
            </button>
            {ChartUI}
          </div>
        </div>
      )}
    </>
  );
};

export default LineChartCard;
