import HeadingChef from "@/components/chef/HeadingChef";
import NavChef from "@/components/chef/NavChef";
import { Fragment, useState } from "react";
import { Outlet } from "react-router-dom";

const ChefLayout = () => {
  const [isOpen, setIsOpen] = useState(
    () => typeof window === "undefined" || window.innerWidth >= 640
  );

  const handleToggleNavbar = () => {
    setIsOpen(!isOpen);
  };

   

  return (
    <Fragment >
      <div className="fixed top-0 left-0 w-full z-50 bg-white ">
        <HeadingChef isOpen={isOpen} handleToggleNavbar={handleToggleNavbar} />
      </div>

      {/* Lớp phủ mờ khi mở menu trên mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 top-[64px] bg-black/40 z-30 sm:hidden"
          onClick={handleToggleNavbar}
        />
      )}

      <div className="flex">
        <div
          className={`fixed left-0 top-[64px] h-[calc(100vh-64px)] bg-white shadow-md z-40 overflow-hidden transition-all duration-200 ease-in-out ${
            isOpen ? "w-[65%] sm:w-[20%]" : "w-0 sm:w-[6%]"
          }`}
        >
          <NavChef isOpen={isOpen} />
        </div>
        <div
          className={`transition-all duration-300 h-full mt-[64px] p-4 w-full flex justify-center items-center overflow-x-hidden ${
            isOpen ? "sm:w-[80%] sm:ml-[20%]" : "sm:w-[94%] sm:ml-[6%]"
          }`}
        >
          <Outlet />
        </div>
      </div>
    </Fragment>
  );
};

export default ChefLayout;
