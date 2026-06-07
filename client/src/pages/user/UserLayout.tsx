import CartIcon from "@/icons/CartIcon";
import { Link, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Logo from "@/icons/Logo";
import { useUserInfo } from "@/hook/auth";

const UserLayout = () => {
  const quantity = useSelector(
    (state: RootState) => state.orderItem.items.length
  );
  const location = useLocation();
  const { role, _id } = useUserInfo();

  return (
    <>
      {/* Giỏ hàng */}
      {(role === "user" || role === "guest") && (
        <div
          className="fixed flex gap-2 items-center justify-center z-[100]"
          style={{
            position: "fixed", // Ensure fixed positioning
            right: `calc(1% + 10px)`, // Moves to the right based on quantity
            bottom: `calc(2% + 20px)`, // Moves down based on quantity
          }}
        >
          {/* Cart Button */}
          <Link
            to="/cart"
            className="relative z-[100] h-12 w-12 p-2.5 rounded-full bg-gradient-to-br from-primary-100 to-primary-400 shadow-lg hover:scale-105 transition-transform"
          >
            <span className="text-xs w-[20px] h-[20px] absolute -top-2 -left-2 text-primary-100 rounded-full bg-white flex justify-center items-center border-primary-100 border-2 font-bold">
              {quantity}
            </span>
            <CartIcon className="w-full h-full" fill="#ffffff" />
          </Link>
        </div>
      )}

      <div className="flex flex-col w-full h-fit relative">
        <div
          className={`h-[50px] w-full text-white flex items-center px-2 relative z-[9999] ${
            location.pathname === "/" ? "" : "bg-primary-100 shadow-md"
          }`}
        >
          <Link to="/" className="sm:block hidden z-20">
            <Logo
              className="w-[27vw] lg:w-[10vw] "
              fill={location.pathname === "/" ? "white" : "white"}
            />
          </Link>

          <div className="flex gap-[3vw] lg:gap-[7vw]  justify-center  text-[3vw] sm:text-[1.3vw] absolute left-1/2 transform -translate-x-1/2 w-full">
            <Link
              to="/"
              className={location.pathname === "/" ? "underline " : ""}
            >
              Trang chủ
            </Link>
            {(role === "user" || role === "guest") && (
              <Link
                to="/menu"
                className={location.pathname === "/menu" ? "underline" : ""}
              >
                Menu
              </Link>
            )}

            <Link
              to="/blog"
              className={location.pathname === "/blog" ? "underline" : ""}
            >
              Diễn đàn
            </Link>
            {(role === "user" || role === "guest") && (
              <Link
                to="/ordered"
                className={location.pathname === "/ordered" ? "underline" : ""}
              >
                Lịch sử
              </Link>
            )}
          </div>
          <Link
            to="/login/admin"
            className={`absolute right-6 z-20 bg-primary-100 rounded-lg px-2 ${
              _id ? "hidden" : "block"
            }`}
          >
            Đăng nhập
          </Link>
          {role === "manager" && (
            <Link
              to="/dashboard"
              className={`absolute right-6 z-20 bg-primary-100 rounded-lg px-2 `}
            >
              Tới trang quản lý
            </Link>
          )}
          {role === "staff" && (
            <Link
              to="/staff/show-table"
              className={`absolute right-6 z-20 bg-primary-100 rounded-lg px-2 `}
            >
              Tới trang chính
            </Link>
          )}
          {(role === "chef" || role === "chef_head") && (
            <Link
              to="/chef/confirm-order"
              className={`absolute right-6 z-20 bg-primary-100 rounded-lg px-2 `}
            >
              Tới bếp
            </Link>
          )}
        </div>
        <div className="flex-1 w-full flex justify-center">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default UserLayout;
