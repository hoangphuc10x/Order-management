import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import HeadingStaff from "@/components/staff/HeadingStaff";

const StaffLayout = () => {
  return (
    <Fragment>
      <div className="fixed top-0 left-0 w-full z-50 bg-white">
        <HeadingStaff />
      </div>
      <div className="mt-[64px] h-[calc(100vh-64px)] w-full">
        <Outlet />
      </div>
    </Fragment>
  );
};

export default StaffLayout;
