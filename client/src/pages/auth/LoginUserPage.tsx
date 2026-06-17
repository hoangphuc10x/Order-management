import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { Phone } from "lucide-react";
import FormField from "../../components/FormField";
import { useLoginMutation } from "@/service/rootApi";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/redux/slices/authSlice";
import { toast } from "sonner";
import { RootState } from "@/redux/store";

interface LoginWithPhone {
  phoneNumber: string;
}

const LoginUserPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tableInfo = useSelector((state: RootState) => state.table.tableInfo);

  const formSchema = useMemo(
    () =>
      yup.object().shape({
        phoneNumber: yup
          .string()
          .matches(/^(0|\+84)\d{9}$/, t("auth.phoneInvalid"))
          .required(t("auth.phoneRequired")),
      }),
    [t]
  );

  const [loginMutation, { isSuccess, data, error, isError, isLoading }] =
    useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginWithPhone>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const onSubmit = (formData: LoginWithPhone) => {
    try {
      console.log("data", formData);
      // Cho phép đăng nhập kể cả khi chưa quét bàn; sau đó sẽ hướng dẫn quét.
      loginMutation({
        usernameOrEmail: formData.phoneNumber,
        password: formData.phoneNumber,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      console.log("đăng nhập thành công");
      dispatch(
        login({
          accessToken: data.accessToken,
          userInfo: data.user,
          refreshToken: data.refreshToken,
        })
      );
      toast.success(t("auth.loginSuccess"));
      // Chưa quét bàn -> sang trang hướng dẫn quét QR; đã quét -> vào menu.
      navigate(tableInfo._id ? "/menu" : "/scan");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error && "status" in error && error.status === 404) {
      toast.error(t("auth.phoneNotRegistered"));
    }
  }, [isError]);

  return (
    <div className="sm:w-[496px] absolute sm:top-14 sm:left-32 h-fit w-full top-5 flex justify-center ">
      <div className="flex flex-col items-center justify-center  w-[80vw] ">
        <p className="text-3xl font-bold mb-12 mt-7 text-white ">
          {t("auth.loginTitle")}
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <FormField<LoginWithPhone>
            className="mb-8"
            name="phoneNumber"
            Icon={Phone}
            error={errors.phoneNumber}
            control={control}
            type="text"
            placeholder={t("auth.phone")}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 text-white font-semibold bg-gradient-to-r from-primary-100 to-primary-400 rounded-lg hover:opacity-90 shadow-md transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? t("common.processing") : t("auth.loginBtn")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginUserPage;
