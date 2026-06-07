import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/LogoApp.png";
import { ChevronDown, LogOut, Menu, UserRound } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { toast } from "sonner";
interface HeadingAdminProps {
  isOpen: boolean;
  handleToggleNavbar: () => void;
}

const HeadingAdmin = ({ isOpen, handleToggleNavbar }: HeadingAdminProps) => {
  const [, setIsHovered] = useState(false);
  const [isDown, setIsDown] = useState(false);
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login/admin");
    toast.success("Đăng xuất thành công");
    setTimeout(() => {
      dispatch(logout());
    }, 500);
  };

  return (
    <header className="bg-white shadow">
      <div className="container flex justify-between items-center border-b border-b-[#E9EAEC] h-[64px] lg:max-w-[1748px]">
        <div className="flex items-center gap-20 px-16">
          <Link to={""}>
            <img src={logo} alt="" />
          </Link>
          <div
            className=" rounded-md bg-slate-100 hover:opacity-70 cursor-pointer p-1"
            onClick={handleToggleNavbar}
          >
            <Menu className={`${isOpen ? "" : "rotate-180"} w-6 h-6`} />
          </div>
        </div>
        <div className="flex justify-between items-center gap-5">
          <div className="flex items-center">
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className="flex justify-between items-center gap-5 px-10 py-1 rounded-md hover:bg-secondary z-10 hover:cursor-pointer"
                onClick={() => setIsDown(!isDown)}
              >
                <UserRound />
                <ChevronDown className={"size-5"} />
                {isDown && (
                  <div className="absolute top-10 right-5 bg-white shadow-lg rounded-md w-fit border-2 border-primary-100">
                    <button
                      className="flex items-center p-3 w-full gap-4 h-10 text-[#424242] hover:bg-slate-100 cursor-pointer rounded-md"
                      onClick={handleLogout}
                    >
                      Logout
                      <LogOut size={16} />
                    </button>
                  </div>
                )}
              </div>
              <div className="absolute after:contents w-full h-4 top-12"></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};



export default HeadingAdmin;
