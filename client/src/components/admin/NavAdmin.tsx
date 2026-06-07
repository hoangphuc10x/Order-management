import { useState } from "react";
import { NavLink } from "react-router-dom";
import TableIcon from "../../icons/TableIcon";
import DishIcon from "../../icons/DishIcon";
import PeopleIcon from "../../icons/PeopleIcon";
import MoneyIcon from "../../icons/MoneyIcon";
import QrIcon from "../../icons/QrIcon";
import DashboardIcon from "../../icons/DashboardIcon";
import DiscountIcon from "../../icons/DiscountIcon";

const NavAdmin = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div className="w-full h-full bg-white border-r border-gray-200 py-4 overflow-y-auto">
      <div className="w-full flex flex-col gap-1 px-2">
        <ItemNavbar
          label="Bảng điều khiển"
          Icon={DashboardIcon}
          path="/dashboard"
          isOpen={isOpen}
        />
        <ItemNavbar
          label="Quản lý bàn"
          Icon={TableIcon}
          path="/manage-tables"
          isOpen={isOpen}
        />
        <ItemNavbar
          label="Quản lý món ăn"
          Icon={DishIcon}
          path="/manager-foods"
          isOpen={isOpen}
        />
        <ItemNavbar
          label="Quản lý nhân viên"
          Icon={PeopleIcon}
          path="/manager-staffs"
          isOpen={isOpen}
        />
        <ItemNavbar
          label="Quản lý doanh thu"
          Icon={MoneyIcon}
          path="/manager-revenues"
          isOpen={isOpen}
        />
        <ItemNavbar
          label="Tạo QR thanh toán"
          Icon={QrIcon}
          path="/createqr-payment"
          isOpen={isOpen}
        />
        <ItemNavbar
          label="Mã giảm giá"
          Icon={DiscountIcon}
          path="/discounts"
          isOpen={isOpen}
        />
      </div>
    </div>
  );
};

interface ItemNavbarProps {
  label: string;
  Icon: React.ElementType;
  path: string;
  isOpen: boolean;
}

const ItemNavbar = ({ label, Icon, path, isOpen }: ItemNavbarProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <NavLink
      to={path}
      title={!isOpen ? label : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={({ isActive }) =>
        `relative flex items-center gap-4 rounded-xl py-3 transition-all duration-200 ${
          isOpen ? "px-4" : "px-0 justify-center"
        } ${
          isActive
            ? "bg-primary-100/15 text-primary-100 font-semibold"
            : "text-text-200 hover:bg-hover"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {/* Left accent bar when active */}
          <span
            className={`absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-r-full bg-primary-100 transition-opacity ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          />
          <Icon fill={isActive || isHovered ? "#7C3AED" : "#4F4F4F"} />
          {isOpen && (
            <span className="text-[15px] whitespace-nowrap">{label}</span>
          )}
        </>
      )}
    </NavLink>
  );
};

export default NavAdmin;
