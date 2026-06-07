import { Link, useNavigate, useParams } from "react-router-dom";
import Logo from "@/icons/Logo";
import { Table } from "@/service/tableApi";
import Loading from "../Loading";
import { ChevronDown, LayoutGrid, LogOut, UserRound } from "lucide-react";
import { useGetTableOccupiedQuery } from "@/service/kitchenApi";
import { useEffect, useState } from "react";
import { socket } from "@/provider/SocketProvider";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { useUserInfo } from "@/hook/auth";

interface HeadingChefProps {
  isOpen: boolean;
  handleToggleNavbar: () => void;
}

const ROLE_LABELS: Record<string, string> = {
  manager: "Quản lý",
  staff: "Nhân viên",
  chef: "Bếp",
  chef_head: "Bếp trưởng",
};

const HeadingChef: React.FC<HeadingChefProps> = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useUserInfo();
  const { id: activeTableId } = useParams<{ id: string }>();
  const [isDown, setIsDown] = useState(false);
  const { data = { success: false, data: [] }, isLoading, refetch } =
    useGetTableOccupiedQuery();

  const displayName = userInfo?.name || userInfo?.username || "Tài khoản";

  const handleLogout = () => {
    navigate("/login/admin");
    toast.success("Đăng xuất thành công");
    setTimeout(() => {
      dispatch(logout());
    }, 500);
  };

  useEffect(() => {
    socket.on("table:long-waiting", (data) => {
      console.log("table:long-waiting", data);
      if (data) {
        refetch();
        toast.warning(data.message);
      }
    });

    return () => {
      socket.off("table:long-waiting");
    };
  }, []);

  const tableList = [...data.data].sort((a: Table, b: Table) => {
    return Number(b.inform) - Number(a.inform);
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <header className="bg-gradient-to-r from-primary-100 to-primary-400 shadow w-screen h-[64px]">
      <div className="flex items-center gap-4 h-full w-full px-4 sm:px-6">
        {/* Logo */}
        <Link to="/chef/confirm-order" className="shrink-0">
          <Logo fill="white" width="140" height="36" />
        </Link>

        {/* Danh sách số bàn */}
        <span className="text-base font-bold text-white shrink-0 ml-2">
          Số bàn
        </span>
        <div
          className="flex items-center gap-2 flex-1 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {tableList.length > 0 ? (
            tableList.map((table: Table) => {
              const isActive = activeTableId === table._id;
              return (
                <span
                  key={table._id}
                  onClick={() =>
                    navigate(`/chef/table/${table._id}`, {
                      state: { tableName: table.tableNumber },
                    })
                  }
                  className={`shrink-0 px-3 py-1.5 rounded-lg border-2 text-sm font-semibold cursor-pointer transition-all min-w-[64px] text-center ${
                    table.inform
                      ? "bg-red-500 text-white border-red-500 animate-pulse"
                      : isActive
                      ? "bg-white text-primary-100 border-white shadow-md scale-105"
                      : "bg-white/20 text-white border-white/40 hover:bg-white/30"
                  }`}
                >
                  {table.tableNumber}
                </span>
              );
            })
          ) : (
            <span className="text-white/80 italic text-sm">
              Không có bàn nào!!
            </span>
          )}
        </div>

        {/* Xem các bàn đang đặt món */}
        <div className="relative group shrink-0">
          <Link
            to="/chef/table"
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/20 text-white hover:bg-white hover:text-primary-100 transition-colors"
          >
            <LayoutGrid size={20} />
          </Link>
          <span className="pointer-events-none absolute top-12 right-0 z-30 whitespace-nowrap rounded-md bg-gray-800 px-2.5 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
            Xem các bàn đang đặt món
          </span>
        </div>

        {/* Khu vực tài khoản */}
        <div className="relative shrink-0">
          <div
            className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full hover:bg-white/15 cursor-pointer transition-colors"
            onClick={() => setIsDown(!isDown)}
          >
            <div className="hidden sm:flex flex-col items-end leading-tight">
              <span className="text-sm font-semibold text-white">
                {displayName}
              </span>
              <span className="text-xs text-white/70">
                {ROLE_LABELS[userInfo?.role || ""] || userInfo?.role || ""}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-primary-100">
              <UserRound size={20} />
            </div>
            <ChevronDown
              className={`size-4 text-white transition-transform ${
                isDown ? "rotate-180" : ""
              }`}
            />
          </div>
          {isDown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDown(false)}
              />
              <div className="absolute top-14 right-0 z-20 bg-white shadow-lg rounded-xl w-48 border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {userInfo?.email}
                  </p>
                </div>
                <button
                  className="flex items-center justify-between p-3 w-full gap-4 text-[#424242] hover:bg-slate-100 cursor-pointer transition-colors"
                  onClick={handleLogout}
                >
                  Đăng xuất
                  <LogOut size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeadingChef;
