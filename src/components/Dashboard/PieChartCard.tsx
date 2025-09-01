// PieChartCard.tsx
"use client";
import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LegendPayload,
} from "recharts";
import { Download, Maximize, Minimize } from "lucide-react";

interface PieChartCardProps {
  sampleData: any[];
  labelKey: string;
  valueKey: string;
  headingText: string;
  onApplyFilter: (fromDate: string, toDate: string) => void;
}

const generateColors = (numColors: number) => {
  return Array.from({ length: numColors }, (_, i) => {
    const hue = (i * 137.508) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  });
};

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

const PieChartCard: React.FC<PieChartCardProps> = ({
  sampleData,
  labelKey,
  valueKey,
  headingText,
  onApplyFilter,
}) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Build pieData dynamically
  const pieData = sampleData.map((item) => ({
    name: item[labelKey],
    value: item[valueKey],
  }));

  // Generate dynamic colors
  const COLORS = generateColors(pieData.length);

  // Initial visibility (all true)
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});

  // Reset visibility whenever sampleData changes
  useEffect(() => {
    const initialVisibility = pieData.reduce((acc, item) => {
      acc[item.name] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setVisibility(initialVisibility);
  }, [sampleData]);

  // Toggle visibility
  const handleLegendClick = (dataKey?: string) => {
    if (!dataKey) return;
    setVisibility((prev) => ({
      ...prev,
      [dataKey]: !prev[dataKey],
    }));
  };

  // Apply visibility filter
  const filteredData = pieData.map((item) => ({
    ...item,
    value: visibility[item.name] ? item.value : 0,
  }));

  // Chart UI (reusable for normal + fullscreen)
  const ChartUI = (
    <ResponsiveContainer width="100%" height={isFullscreen ? 500 : 300}>
      <PieChart>
        <Tooltip />
        <Legend onClick={(e: LegendPayload) => handleLegendClick(e.value)} />
        <Pie
          data={filteredData}
          dataKey="value"
          nameKey="name"
          outerRadius={isFullscreen ? 200 : 100}
          label
        >
          {filteredData.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <>
      <div className="bg-white shadow-md rounded-2xl p-4">
        {/* Header Row: Title + Download + Zoom */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">{headingText}</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => downloadCSV(filteredData, `${headingText}.csv`)}
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

        {/* Second Row: Filters */}
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
          <button
            onClick={() => onApplyFilter(fromDate, toDate)}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          >
            Apply
          </button>
        </div>

        {/* Chart */}
        {ChartUI}
      </div>

      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="w-full h-[85%]"><button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-3 right-3 p-2 rounded bg-gray-200"
            >
              <Minimize size={20} />
            </button>{ChartUI}
          </div>
        </div>
      )}
    </>
  );
};

export default PieChartCard;
