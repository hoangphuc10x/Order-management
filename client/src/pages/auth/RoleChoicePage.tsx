import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserRound, Briefcase } from "lucide-react";

// Màn chọn vai trò khi đăng nhập: khách hàng hoặc nhân viên/quản lý.
const RoleChoicePage = () => {
  const { t } = useTranslation();

  return (
    <div className="sm:w-[496px] absolute sm:top-14 sm:left-32 h-fit w-full top-5 flex justify-center">
      <div className="flex flex-col items-center w-[85vw] sm:w-full gap-8">
        <p className="text-3xl font-bold mt-7 text-white text-center">
          {t("auth.roleChoiceTitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Link
            to="/login/customer"
            className="flex-1 flex flex-col items-center gap-3 bg-white rounded-2xl px-6 py-8 shadow-md hover:scale-105 transition-transform"
          >
            <UserRound className="size-12 text-primary-100" />
            <span className="font-semibold text-primary-100 text-lg">
              {t("auth.roleCustomer")}
            </span>
          </Link>
          <Link
            to="/login/admin"
            className="flex-1 flex flex-col items-center gap-3 bg-white rounded-2xl px-6 py-8 shadow-md hover:scale-105 transition-transform"
          >
            <Briefcase className="size-12 text-primary-100" />
            <span className="font-semibold text-primary-100 text-lg">
              {t("auth.roleStaff")}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoleChoicePage;
