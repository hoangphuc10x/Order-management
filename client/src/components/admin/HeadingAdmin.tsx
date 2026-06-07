import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/icons/Logo";
import { ChevronDown, LogOut, Menu, UserRound } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { toast } from "sonner";
import { useUserInfo } from "@/hook/auth";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface HeadingAdminProps {
  isOpen: boolean;
  handleToggleNavbar: () => void;
}

const ROLE_LABELS: Record<string, string> = {
  manager: "Quản lý",
  staff: "Nhân viên",
  chef: "Bếp",
  chef_head: "Bếp trưởng",
};

const HeadingAdmin = ({ isOpen, handleToggleNavbar }: HeadingAdminProps) => {
  const [isDown, setIsDown] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useUserInfo();
  const { t } = useTranslation();

  const displayName = userInfo?.name || userInfo?.username || "Tài khoản";

  const handleLogout = () => {
    navigate("/login/admin");
    toast.success("Đăng xuất thành công");
    setTimeout(() => {
      dispatch(logout());
    }, 500);
  };

  return (
    <header className="bg-gradient-to-r from-primary-100 to-primary-400 shadow">
      <div className="flex justify-between items-center h-[64px] px-4 sm:px-6">
        {/* Left: logo + toggle */}
        <div className="flex items-center gap-4">
          <Link to={"/dashboard"} className="shrink-0">
            <Logo fill="white" width="140" height="36" />
          </Link>
          <button
            className="rounded-lg bg-white/20 hover:bg-white/30 text-white cursor-pointer p-2 transition-colors"
            onClick={handleToggleNavbar}
            aria-label="Toggle sidebar"
          >
            <Menu
              className={`${isOpen ? "" : "rotate-180"} w-5 h-5 transition-transform`}
            />
          </button>
        </div>

        {/* Right: language + user menu */}
        <div className="flex items-center gap-1">
        <LanguageSwitcher variant="light" />
        <div className="relative">
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
                  {t("common.logout")}
                  <LogOut size={16} />
                </button>
              </div>
            </>
          )}
        </div>
        </div>
      </div>
    </header>
  );
};

export default HeadingAdmin;
