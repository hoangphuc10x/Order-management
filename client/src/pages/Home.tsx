import Logo from "@/icons/Logo";
import { Link } from "react-router-dom";
import HomePage from "./user/HomePage";

const Home = () => {
  return (
    <>
      <div className="flex flex-col w-full h-fit relative">
        <div
          className={`h-[50px] w-full text-white flex items-center px-2 relative z-[9999] ${
            location.pathname === "/" ? "" : "bg-primary-100 shadow-md"
          }`}
        >
          <Link to="/home" className="sm:block hidden z-20">
            <Logo
              className="w-[27vw] lg:w-[10vw] "
              fill={location.pathname === "/" ? "#fbbc05 " : "white"}
            />
          </Link>

          <div className="flex gap-[3vw] lg:gap-[7vw]  sm:justify-center justify-around text-[3vw] sm:text-[1.3vw] absolute left-1/2 transform -translate-x-1/2 w-full">
            <Link
              to="/"
              className={location.pathname === "/" ? "underline " : ""}
            >
              Trang chủ
            </Link>
            <Link
              to="/menu"
              className={location.pathname === "/menu" ? "underline" : ""}
            >
              Menu
            </Link>

            <Link
              to="/blog"
              className={location.pathname === "/blog" ? "underline" : ""}
            >
              Diễn đàn
            </Link>
            <Link
              to="/ordered"
              className={location.pathname === "/ordered" ? "underline" : ""}
            >
              Lịch sử
            </Link>
          </div>
        </div>
        <div className="flex-1 w-full flex justify-center">
          <HomePage />
        </div>
      </div>
    </>
  );
};

export default Home;
