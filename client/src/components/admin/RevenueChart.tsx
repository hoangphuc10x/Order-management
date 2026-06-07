// import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useGetRevenueAnnualQuery } from "@/service/adminAPI";
import { useState } from "react";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RevenueChart = () => {
  const [year] = useState<string | null>("");

  // Provide a fallback year (e.g., current year) if `year` is null or empty
  const currentYear = year || new Date().getFullYear().toString();

  const { data } = useGetRevenueAnnualQuery({ year: currentYear });

  const revenueAnnualData = data?.result;

  // console.log("revenueAnnualData", revenueAnnualData);

  const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString(); // tháng 1–12
    const found = revenueAnnualData?.find((item) => item._id === 0 + month);
    
    if (!found) return 0;

    return typeof found.totalRevenue === "number"
      ? found.totalRevenue
      : Number(found.totalRevenue?.$numberDecimal || 0);
  });

  const labels = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Tổng doanh thu hàng tháng",
        data: monthlyRevenue,
        fill: false,
        borderColor: "#C15555",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        align: "end" as const,
        labels: {
          boxWidth: 12,
        },
      },
      title: {
        display: true,
        text: "Thống kê doanh thu",
        color: "#FBBC05",
        font: {
          size: 20,
        },
        align: "start" as const,
      },
    },
  };

  return (
    <div className="bg-white rounded-lg p-5 h-fit">
      <div
        className="flex flex-col gap-5 rounded-lg"
        style={{ maxHeight: "350px" }}
      >
        <Line className="w-full" options={options} data={chartData} />
      </div>
    </div>
  );
};

export default RevenueChart;
