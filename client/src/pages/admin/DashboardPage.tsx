import ItemsDashboard from "../../components/admin/ItemsDashboard";
import RevenueChart from "../../components/admin/RevenueChart";
import TopDishFavorite from "../../components/admin/TopDishFavourite";

const DashboardPage = () => {
  return (
    <div className="flex flex-col gap-5 p-5 my-5 mr-5 w-full h-full">
      <ItemsDashboard />
      <div className="flex flex-col gap-5 border-2 rounded">
        <RevenueChart />
      </div>
      <div className="grid gap-5 h-[350px]">
        <TopDishFavorite />
      </div>
    </div>
  );
};

export default DashboardPage;
