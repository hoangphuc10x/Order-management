import { saveTableInfo } from "@/redux/slices/tableSlice";
import { useGetAllTablesQuery } from "@/service/tableApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";

const CheckPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { data, isSuccess } = useGetAllTablesQuery();

  useEffect(() => {
    if (isSuccess) {
      const tableInfo = data.result.find((table) => table.slug === slug);
      if (tableInfo) {
        dispatch(saveTableInfo({ tableInfo }));
      }
    }
  }, [isSuccess]);
  return (
    <div className="flex  sm:w-[496px] absolute sm:top-14 sm:left-32 h-fit justify-center top-5 w-full">
      <div className="flex flex-col items-center justify-center">
        <p className="text-3xl font-bold mb-12 mt-7 text-[#FBBC05] ">
          Bạn đã có tài khoản chưa?
        </p>
        <div className="flex justify-around w-full">
          <Link to="/login" className=" btn !text-white">
            Đã có tài khoản
          </Link>
          <Link
            to="/register"
            className="btn !bg-white !text-primary-100 border-2 border-primary-100"
          >
            Chưa có tài khoản
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckPage;
