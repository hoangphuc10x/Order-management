import { useGetOrderCountMonthlyQuery } from "@/service/adminAPI";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { useState } from "react";
import { Bar } from "react-chartjs-2";
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

const FiguresPostChart = () => {
  const [year] = useState<string | null>("");

  // Provide a fallback year (e.g., current year) if `year` is null or empty
  const currentYear = year || new Date().getFullYear().toString();
  const { data } = useGetOrderCountMonthlyQuery({
    year: currentYear,
  });

  const revenueAnnualData = data?.result;

  const monthlyRevenue =
    revenueAnnualData?.map(
      (item) =>
        typeof item.orderCount === "number"
          ? item.orderCount // If it's already a number, use it directly
          : Number(item.orderCount) // Otherwise, convert it to a number
    ) || [];

  // console.log("monthlyRevenue", monthlyRevenue);

  const postLabels = [
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
  const ordersData = {
    labels: postLabels,
    datasets: [
      {
        label: "Bài viết",
        data: monthlyRevenue,
        backgroundColor: "#FBBC05",
        borderRadius: 4,
      },
    ],
  };

  const postOptions = {
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
        text: "Thống kê bài viết",
        align: "start" as const,
        font: {
          size: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { stepSize: 20 },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg p-5 h-[350px]">
      <Bar className="w-full " options={postOptions} data={ordersData} />
    </div>
  );
};

export default FiguresPostChart;
