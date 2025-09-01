"use client";
import withAuth from "@/hoc/withAuth";
import LineChartCard from "@/components/Dashboard/LineChartCard";
import BarChartCard from "@/components/Dashboard/BarChartCard";
import PieChartCard from "@/components/Dashboard/PieChartCard";
import MultiBarChartCard from "@/components/Dashboard/MultiBarChartCard";
import React, { useState, useRef, useEffect } from 'react'
import { getStatusWiseCount, getPriorityWiseCount } from '@/services/contentService';

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
  


  


    const [statusDataCount, setStatusDataCount] = useState([])
    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toISOString().split("T")[0];
        handleStatusApplyFilter(formattedDate, formattedDate);
        handlePriorityApplyFilter('date');
    }, [])

    const handleStatusApplyFilter = async (fromDate: string, toDate: string) => {
        //console.log("Filter applied:", fromDate, toDate);
        const params: Record<string, string> = {};
        if (fromDate) params.from_date = fromDate;
        if (toDate) params.to_date = toDate;
        const response = await getStatusWiseCount(params);
        setStatusDataCount(response.data);
    };


    const [priorityDataCount, setPriorityDataCount] = useState<any[]>([]);
    const handlePriorityApplyFilter = async (dateType: string,) => {
        const params: Record<string, string> = {};
        if (dateType) params.date_type = dateType;
        const response = await getPriorityWiseCount(params);
        setPriorityDataCount(response.data);
    };

  


  return (
    <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <LineChartCard
        key={`priority-${JSON.stringify(priorityDataCount)}`}
        sampleData={priorityDataCount}
        headingText="Priority"
        onApplyFilter={handlePriorityApplyFilter}
      />
      <PieChartCard
        key={`status-${JSON.stringify(statusDataCount)}`}
        sampleData={statusDataCount}
        labelKey="status_text"
        valueKey="count"
        headingText="Status"
        onApplyFilter={handleStatusApplyFilter}
      />
      <BarChartCard sampleData={rawData} />
      
      <BarChartCard sampleData={rawData1} />
    </div>
  );
}

export default withAuth(DashboardPage);
