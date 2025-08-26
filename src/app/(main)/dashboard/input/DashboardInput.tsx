"use client";
import withAuth from "@/hoc/withAuth";
import LineChartCard from "@/components/Dashboard/LineChartCard";
import BarChartCard from "@/components/Dashboard/BarChartCard";
import PieChartCard from "@/components/Dashboard/PieChartCard";
import MultiBarChartCard from "@/components/Dashboard/MultiBarChartCard";
import React, { useState, useRef, useEffect } from 'react'

function DashboardPage() {
  const rawData = [
    { name: "Mon", value: 40, value2: 30, date: "2025-08-18" },
    { name: "Tue", value: 30, value2: 50, date: "2025-08-19" },
    { name: "Wed", value: 20, value2: 40, date: "2025-08-20" },
    { name: "Thu", value: 27, value2: 60, date: "2025-08-21" },
    { name: "Fri", value: 18, value2: 35, date: "2025-08-22" },
  ];

  const rawData1 = [
    { name: "Mon", value: 40,  date: "2025-08-18" },
    { name: "Tue", value: 30, date: "2025-08-19" },
    { name: "Wed", value: 20,date: "2025-08-20" },
    { name: "Thu", value: 27, date: "2025-08-21" },
    { name: "Fri", value: 18, date: "2025-08-22" },
  ];
  
  const [priorityDataCount, setPriorityDataCount] = useState([
      { count: 10, stage_number: 1, status_text: "Draft" },
      { count: 3, stage_number: 2, status_text: "Waiting in Input" },
      { count: 5, stage_number: 3, status_text: "Waiting in Output" },
      { count: 9, stage_number: 4, status_text: "Rejected" },
    ])

  const handlePriorityApplyFilter = (fromDate: string, toDate: string) => {
    console.log("Filter applied:", fromDate, toDate);
    setStatusDataCount([
      { count: 10, stage_number: 1, status_text: "Draft" },
      { count: 30, stage_number: 2, status_text: "Waiting in Input" },
      { count: 55, stage_number: 3, status_text: "Waiting in Output" },
      { count: 99, stage_number: 4, status_text: "Rejected" },
    ]);
  };


  const [statusDataCount, setStatusDataCount] = useState([
          { count: 10, stage_number: 1, status_text: "Draft" },
          { count: 3, stage_number: 2, status_text: "Waiting in Input" },
          { count: 5, stage_number: 3, status_text: "Waiting in Output" },
          { count: 9, stage_number: 4, status_text: "Rejected" },
        ])

  const handleStatusApplyFilter = (fromDate: string, toDate: string) => {
    console.log("Filter applied:", fromDate, toDate);
    setStatusDataCount([
      { count: 10, stage_number: 1, status_text: "Draft" },
      { count: 30, stage_number: 2, status_text: "Waiting in Input" },
      { count: 55, stage_number: 3, status_text: "Waiting in Output" },
      { count: 99, stage_number: 4, status_text: "Rejected" },
    ]);
  };


  return (
    <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <LineChartCard sampleData={rawData} />
      <BarChartCard sampleData={rawData} />
      <PieChartCard
        sampleData={statusDataCount}
        labelKey="status_text"
        valueKey="count"
        headingText="Status"
        onApplyFilter={handleStatusApplyFilter}
      />
      <BarChartCard sampleData={rawData1} />
    </div>
  );
}

export default withAuth(DashboardPage);
