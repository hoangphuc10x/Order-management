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
    <div className="w-full h-full bg-white border-r border-gray-200">
      <div className="w-full">
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
    <div
      className="flex py-1  w-full gap-5 items-center hover:text-primary hover:bg-hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <NavLink
        to={path}
        className={({ isActive }) =>
          isActive ? "w-full p-3 pl-9  bg-hover" : "pl-9 w-full p-3"
        }
      >
        {({ isActive }) => (
          <div
            className={
              isOpen
                ? isActive
                  ? "flex gap-5 w-full h-full items-center font-semibold text-text-100"
                  : " flex gap-5 w-full h-full items-center"
                : isActive
                ? "flex gap-5 w-full h-full items-center justify-center font-semibold text-text-100"
                : " flex gap-5 w-full h-full items-center justify-center"
            }
          >
            {isOpen ? (
              <>
                <Icon fill={`${isActive || isHovered ? "#FBBC05" : "#000"}`} />
                <span
                  className={`${
                    isOpen
                      ? isActive || isHovered
                        ? "font-semibold text-text-100 block"
                        : ""
                      : isActive
                      ? "font-semibold text-text-100 hidden"
                      : ""
                  }`}
                >
                  {label}
                </span>
              </>
            ) : (
              <Icon fill={`${isActive || isHovered ? "#FBBC05" : "#000"}`} />
            )}
          </div>
        )}
      </NavLink>
    </div>
  );
};

export default NavAdmin;
