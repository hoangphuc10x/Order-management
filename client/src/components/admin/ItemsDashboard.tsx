import { useGetAllRevenueQuery } from "@/service/adminAPI";
import ItemDashboard from "./ItemDashboard";
import { useTranslation } from "react-i18next";
import {
  Calculator,
  CircleUserRound,
  ConciergeBell,
  Utensils,
} from "lucide-react";

const ItemsDashboard = () => {
  const { t } = useTranslation();
  const { data } = useGetAllRevenueQuery();

  const revenueData = data?.result;

  return (
    <div className="grid grid-cols-4 gap-5">
      <ItemDashboard
        title={t("dashboard.totalRevenue")}
        value={Number(revenueData?.totalRevenue).toLocaleString("vi-VN") || 0}
        unit="VNĐ"
        icon={<Calculator className="w-6 h-6" color="#C15555" />}
        color="#EC4899"
        path="/manager-revenues"
      />
      <ItemDashboard
        title={t("dashboard.totalOrders")}
        value={Number(revenueData?.totalOrder).toLocaleString("vi-VN") || 0}
        unit={t("dashboard.orderUnit")}
        icon={<Utensils className="w-6 h-6" color="#ed0d0d" />}
        color="#3EC3FF"
        path="/manage-tables"
      />
      <ItemDashboard
        title={t("dashboard.totalFoods")}
        value={Number(revenueData?.totalMenuItems).toLocaleString("vi-VN") || 0}
        unit={t("dashboard.foodUnit")}
        icon={<ConciergeBell className="w-6 h-6" color="#404040" />}
        color="#48538f"
        path="/manager-foods"
      />
      <ItemDashboard
        title={t("dashboard.totalStaffs")}
        value={Number(revenueData?.totalStaff).toLocaleString("vi-VN") || 0}
        unit={t("dashboard.staffUnit")}
        icon={<CircleUserRound className="w-6 h-6" color="#fff" />}
        color="#C15555"
        path="/manager-staffs"
      />
    </div>
  );
};

export default ItemsDashboard;
