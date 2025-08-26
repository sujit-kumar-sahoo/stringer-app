
"use client";
import React, { useState } from "react";
import withAuth from "@/hoc/withAuth";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";
import { FileDown, Eye, EyeOff } from 'lucide-react'



// reusable filter state
interface DateFilter {
  from: string;
  to: string;
}

// Chart visibility state interface
interface ChartVisibility {
  [key: string]: boolean;
}

function DashBoard() {

  const toggleMultiBarVisibility = (key: string) => {
    setMultiBarVisibility(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Get filtered pie data based on visibility
  const getFilteredPieData = () => {
    return filterData(pieDataRaw, pieApplied).filter(item => 
      pieVisibility[item.name] !== false
    );
  };
  
// CSV export helper
const downloadCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) return;
  const csvRows: string[] = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));

  for (const row of data) {
    const values = headers.map((h) => JSON.stringify(row[h] ?? ""));
    csvRows.push(values.join(","));
  }

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};
  const rawData = [
    { name: "Mon", value: 40, value2: 30, date: "2025-08-18" },
    { name: "Tue", value: 30, value2: 50, date: "2025-08-19" },
    { name: "Wed", value: 20, value2: 40, date: "2025-08-20" },
    { name: "Thu", value: 27, value2: 60, date: "2025-08-21" },
    { name: "Fri", value: 18, value2: 35, date: "2025-08-22" },
  ];

  const pieDataRaw = [
    { name: "Video", value: 400, date: "2025-08-18" },
    { name: "Text", value: 300, date: "2025-08-19" },
    { name: "Image", value: 300, date: "2025-08-20" },
    { name: "Audio", value: 200, date: "2025-08-21" },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // per-card date filters (input values)
  const [lineFilter, setLineFilter] = useState<DateFilter>({ from: "", to: "" });
  const [barFilter, setBarFilter] = useState<DateFilter>({ from: "", to: "" });
  const [pieFilter, setPieFilter] = useState<DateFilter>({ from: "", to: "" });
  const [multiBarFilter, setMultiBarFilter] = useState<DateFilter>({ from: "", to: "" });

  // applied filters (used for rendering)
  const [lineApplied, setLineApplied] = useState<DateFilter>({ from: "", to: "" });
  const [barApplied, setBarApplied] = useState<DateFilter>({ from: "", to: "" });
  const [pieApplied, setPieApplied] = useState<DateFilter>({ from: "", to: "" });
  const [multiBarApplied, setMultiBarApplied] = useState<DateFilter>({ from: "", to: "" });

  // Per-chart visibility state
  const [lineVisibility, setLineVisibility] = useState<ChartVisibility>({
    value: true,
    value2: true
  });
  const [barVisibility, setBarVisibility] = useState<ChartVisibility>({
    value: true,
    value2: true
  });
  const [pieVisibility, setPieVisibility] = useState<ChartVisibility>({
    Video: true,
    Text: true,
    Image: true,
    Audio: true
  });
  const [multiBarVisibility, setMultiBarVisibility] = useState<ChartVisibility>({
    value: true,
    value2: true
  });

  // Legend click handlers for each chart
  const handleLineLegendClick = (o: any) => {
    const { value } = o;
    setLineVisibility(prev => ({
      ...prev,
      [value]: !prev[value]
    }));
  };

  const handleBarLegendClick = (o: any) => {
    const { value } = o;
    setBarVisibility(prev => ({
      ...prev,
      [value]: !prev[value]
    }));
  };

  const handlePieLegendClick = (o: any) => {
    const { value } = o;
    setPieVisibility(prev => ({
      ...prev,
      [value]: !prev[value]
    }));
  };

  const handleMultiBarLegendClick = (o: any) => {
    const { value } = o;
    setMultiBarVisibility(prev => ({
      ...prev,
      [value]: !prev[value]
    }));
  };

  // Toggle visibility functions
  const toggleLineVisibility = (key: string) => {
    setLineVisibility(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleBarVisibility = (key: string) => {
    setBarVisibility(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const togglePieVisibility = (key: string) => {
    setPieVisibility(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // filter util
  const filterData = (data: any[], filter: DateFilter) => {
    if (!filter.from && !filter.to) return data;
    return data.filter((d) => {
      const dt = new Date(d.date);
      const fromOk = filter.from ? dt >= new Date(filter.from) : true;
      const toOk = filter.to ? dt <= new Date(filter.to) : true;
      return fromOk && toOk;
    });
  };

  // Visibility control component
  const VisibilityControls = ({ visibility, onToggle, chartType }: {
    visibility: ChartVisibility;
    onToggle: (key: string) => void;
    chartType: string;
  }) => (
    <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
      {Object.entries(visibility).map(([key, isVisible]) => (
        <button
          key={key}
          onClick={() => onToggle(key)}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
            isVisible 
              ? 'bg-blue-100 text-blue-700 border border-blue-300' 
              : 'bg-gray-100 text-gray-500 border border-gray-300'
          }`}
          title={`${isVisible ? 'Hide' : 'Show'} ${key}`}
        >
          {isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
          <span className="hidden sm:inline">{key}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

      {/* Line Chart */}
      <div className="bg-white shadow-md rounded-2xl p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
          <h2 className="text-lg font-semibold">Line Chart</h2>
          <FileDown
            className="cursor-pointer text-blue-600 self-end sm:self-auto"
            onClick={() => downloadCSV(filterData(rawData, lineApplied), "line_chart.csv")}
          />
        </div>
        
        <VisibilityControls 
          visibility={lineVisibility} 
          onToggle={toggleLineVisibility}
          chartType="line"
        />
        
        <div className="flex flex-col sm:flex-row gap-2 mb-3 items-stretch sm:items-center">
          <input
            type="date"
            value={lineFilter.from}
            onChange={(e) => setLineFilter({ ...lineFilter, from: e.target.value })}
            className="border rounded px-2 py-1 text-sm"
          />
          <input
            type="date"
            value={lineFilter.to}
            onChange={(e) => setLineFilter({ ...lineFilter, to: e.target.value })}
            className="border rounded px-2 py-1 text-sm"
          />
          <button
            onClick={() => setLineApplied(lineFilter)}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            Apply
          </button>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={filterData(rawData, lineApplied)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {lineVisibility.value && (
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            )}
            {lineVisibility.value2 && (
              <Line type="monotone" dataKey="value2" stroke="#82ca9d" />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="bg-white shadow-md rounded-2xl p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
          <h2 className="text-lg font-semibold">Bar Chart</h2>
          <FileDown
            className="cursor-pointer text-blue-600 self-end sm:self-auto"
            onClick={() => downloadCSV(filterData(rawData, barApplied), "bar_chart.csv")}
          />
        </div>
        
        <VisibilityControls 
          visibility={barVisibility} 
          onToggle={toggleBarVisibility}
          chartType="bar"
        />
        
        <div className="flex flex-col sm:flex-row gap-2 mb-3 items-stretch sm:items-center">
          <input
            type="date"
            value={barFilter.from}
            onChange={(e) => setBarFilter({ ...barFilter, from: e.target.value })}
            className="border rounded px-2 py-1 text-sm"
          />
          <input
            type="date"
            value={barFilter.to}
            onChange={(e) => setBarFilter({ ...barFilter, to: e.target.value })}
            className="border rounded px-2 py-1 text-sm"
          />
          <button
            onClick={() => setBarApplied(barFilter)}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            Apply
          </button>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={filterData(rawData, barApplied)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {barVisibility.value && <Bar dataKey="value" fill="#8884d8" />}
            {barVisibility.value2 && <Bar dataKey="value2" fill="#82ca9d" />}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="bg-white shadow-md rounded-2xl p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
          <h2 className="text-lg font-semibold">Pie Chart</h2>
          <FileDown
            className="cursor-pointer text-blue-600 self-end sm:self-auto"
            onClick={() => downloadCSV(filterData(pieDataRaw, pieApplied), "pie_chart.csv")}
          />
        </div>
        
        <VisibilityControls 
          visibility={pieVisibility} 
          onToggle={togglePieVisibility}
          chartType="pie"
        />
        
        <div className="flex flex-col sm:flex-row gap-2 mb-3 items-stretch sm:items-center">
          <input
            type="date"
            value={pieFilter.from}
            onChange={(e) => setPieFilter({ ...pieFilter, from: e.target.value })}
            className="border rounded px-2 py-1 text-sm"
          />
          <input
            type="date"
            value={pieFilter.to}
            onChange={(e) => setPieFilter({ ...pieFilter, to: e.target.value })}
            className="border rounded px-2 py-1 text-sm"
          />
          <button
            onClick={() => setPieApplied(pieFilter)}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            Apply
          </button>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={getFilteredPieData()}
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
              dataKey="value"
            >
              {getFilteredPieData().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Multi-series Bar Chart */}
      <div className="bg-white shadow-md rounded-2xl p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
          <h2 className="text-lg font-semibold">Multi-series Bar Chart</h2>
          <FileDown
            className="cursor-pointer text-blue-600 self-end sm:self-auto"
            onClick={() => downloadCSV(filterData(rawData, multiBarApplied), "multi_bar_chart.csv")}
          />
        </div>
        
        <VisibilityControls 
          visibility={multiBarVisibility} 
          onToggle={toggleMultiBarVisibility}
          chartType="multiBar"
        />
        
        <div className="flex flex-col sm:flex-row gap-2 mb-3 items-stretch sm:items-center">
          <input
            type="date"
            value={multiBarFilter.from}
            onChange={(e) => setMultiBarFilter({ ...multiBarFilter, from: e.target.value })}
            className="border rounded px-2 py-1 text-sm"
          />
          <input
            type="date"
            value={multiBarFilter.to}
            onChange={(e) => setMultiBarFilter({ ...multiBarFilter, to: e.target.value })}
            className="border rounded px-2 py-1 text-sm"
          />
          <button
            onClick={() => setMultiBarApplied(multiBarFilter)}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            Apply
          </button>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={filterData(rawData, multiBarApplied)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {multiBarVisibility.value && <Bar dataKey="value" fill="#8884d8" />}
            {multiBarVisibility.value2 && <Bar dataKey="value2" fill="#82ca9d" />}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default withAuth(DashBoard);