import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AlignJustify, ConciergeBell } from "lucide-react";
import { useGetAllCategoriesQuery } from "@/service/categoryApi";
import Loading from "../Loading";

const NavChef = ({ isOpen }: { isOpen: boolean }) => {
  const location = useLocation();
  const { data, isLoading } = useGetAllCategoriesQuery();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full h-full py-2  bg-white border-r border-gray-200">
      <h1 className="flex items-center justify-center text-2xl font-bold mb-3">
        Danh mục
      </h1>
      <div className="w-full">
        <ItemNavbar
          label="Xem tất cả món ăn"
          Icon={AlignJustify}
          path="/chef/confirm-order"
          isOpen={isOpen}
        />
        {data?.result
          .filter((category) => category._id !== "67f92beb57c61e12a9d5eb5c")
          .map((category) => (
            <ItemNavbar
              label={category.name}
              key={category._id}
              Icon={ConciergeBell}
              path={`/chef/${category._id}/${category.name}`}
              isOpen={isOpen}
            />
          ))}
      </div>
      <Link
        to="/chef/duplicate-food"
        className={`flex items-center justify-center w-full h-12 mt-3 rounded-lg  font-semibold  transition duration-200 ease-in-out ${
          location.pathname === "/chef/duplicate-food"
            ? "bg-secondary-100 text-primary-100 border-2 border-primary-100"
            : "bg-primary-100 text-white"
        }`}
      >
        Món trùng lặp
      </Link>
      <Link
        to="/chef/history-food"
        className={`flex items-center justify-center w-full h-12 mt-3 rounded-lg  font-semibold  transition duration-200 ease-in-out ${
          location.pathname === "/chef/history-food"
            ? "bg-secondary-100 text-blue-500 border-2 border-blue-500"
            : "bg-blue-500 text-white"
        }`}
      >Món đã hoàn thành</Link>
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

export default NavChef;
