import HeadingChef from "@/components/chef/HeadingChef";
import NavChef from "@/components/chef/NavChef";
import { Fragment, useState } from "react";
import { Outlet } from "react-router-dom";

const ChefLayout = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggleNavbar = () => {
    setIsOpen(!isOpen);
  };

   

  return (
    <Fragment >
      <div className="fixed top-0 left-0 w-full z-50 bg-white ">
        <HeadingChef isOpen={isOpen} handleToggleNavbar={handleToggleNavbar} />
      </div>

      <div className="flex">
        <div
          className={`fixed left-0 top-[64px] h-[calc(100vh-64px)] bg-white shadow-md transition-all duration-200 ease-in-out ${
            isOpen ? "w-[20%]" : "w-[6%]"
          }`}
        >
          <NavChef isOpen={isOpen} />
        </div>
        <div
          className={`ml-auto transition-all duration-300 h-full  mt-[64px] p-4 flex justify-center items-center ${
            isOpen ? "w-[80%] ml-[20%]" : "w-[94%] ml-[6%]"
          }`}
        >
          <Outlet />
        </div>
      </div>
    </Fragment>
  );
};

export default ChefLayout;
