import { useGetAllRevenueQuery } from "@/service/adminAPI";
import ItemDashboard from "./ItemDashboard";
import {
  Calculator,
  CircleUserRound,
  ConciergeBell,
  Utensils,
} from "lucide-react";

const ItemsDashboard = () => {
  const { data } = useGetAllRevenueQuery();

  const revenueData = data?.result;

  return (
    <div className="grid grid-cols-4 gap-5">
      <ItemDashboard
        title="Tổng doanh thu"
        value={Number(revenueData?.totalRevenue).toLocaleString("vi-VN") || 0}
        unit="VNĐ"
        icon={<Calculator className="w-6 h-6" color="#C15555" />}
        color="#ffcf3f"
        path="/manager-revenues"
      />
      <ItemDashboard
        title="Tổng đặt món"
        value={Number(revenueData?.totalOrder).toLocaleString("vi-VN") || 0}
        unit="đặt món"
        icon={<Utensils className="w-6 h-6" color="#ed0d0d" />}
        color="#3EC3FF"
        path="/manage-tables"
      />
      <ItemDashboard
        title="Tổng món ăn"
        value={Number(revenueData?.totalMenuItems).toLocaleString("vi-VN") || 0}
        unit="món ăn"
        icon={<ConciergeBell className="w-6 h-6" color="#F8D01B" />}
        color="#48538f"
        path="/manager-foods"
      />
      <ItemDashboard
        title="Tổng nhân viên"
        value={Number(revenueData?.totalStaff).toLocaleString("vi-VN") || 0}
        unit="Nhân viên"
        icon={<CircleUserRound className="w-6 h-6" color="#fff" />}
        color="#C15555"
        path="/manager-staffs"
      />
    </div>
  );
};

export default ItemsDashboard;
