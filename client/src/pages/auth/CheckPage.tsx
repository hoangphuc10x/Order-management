import { saveTableInfo } from "@/redux/slices/tableSlice";
import { clearCart } from "@/redux/slices/orderSlice";
import { clearOrder } from "@/redux/slices/orderCurrentSlice";
import { useTableInfo } from "@/hook/table";
import { useGetAllTablesQuery } from "@/service/tableApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";


const CheckPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { slug: currentSlug } = useTableInfo();
  const { data, isSuccess } = useGetAllTablesQuery();

  useEffect(() => {
    if (isSuccess) {
      const tableInfo = data.result.find((table) => table.slug === slug);
      if (tableInfo) {
        // Quét sang bàn khác => coi như khách mới ngồi vào bàn: xóa giỏ hàng và
        // đơn cũ để bắt đầu đơn mới theo (user, table).
        if (currentSlug && currentSlug !== tableInfo.slug) {
          dispatch(clearCart());
          dispatch(clearOrder());
        }
        dispatch(saveTableInfo({ tableInfo }));
      }
    }
  }, [isSuccess, slug]);
  return (
    <div className="flex  sm:w-[496px] absolute sm:top-14 sm:left-32 h-fit justify-center top-5 w-full">
      <div className="flex flex-col items-center justify-center">
        <p className="text-3xl font-bold mb-12 mt-7 text-white ">
          {t("auth.hasAccountQuestion")}
        </p>
        <div className="flex justify-around w-full">
          <Link to="/login" className=" btn !text-white">
            {t("auth.haveAccount")}
          </Link>
          <Link
            to="/register"
            className="btn !bg-white !text-primary-100 border-2 border-primary-100"
          >
            {t("auth.noAccount")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckPage;
