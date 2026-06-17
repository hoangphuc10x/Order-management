import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { Phone, User } from "lucide-react";
import FormField from "../../components/FormField";
import { useLoginMutation, useRegisterMutation } from "@/service/rootApi";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/redux/slices/authSlice";
import { toast } from "sonner";
import { RootState } from "@/redux/store";

interface LoginWithPhone {
  fullName: string;
  phoneNumber: string;
}

const RegisterUser: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tableInfo = useSelector((state: RootState) => state.table.tableInfo);

  const formSchema = useMemo(
    () =>
      yup.object().shape({
        fullName: yup.string().required(t("auth.fullNameRequired")),
        phoneNumber: yup
          .string()
          .matches(/^(0|\+84)\d{9}$/, t("auth.phoneInvalid"))
          .required(t("auth.phoneRequired")),
      }),
    [t]
  );

  const [registerMutation, { isLoading: isRegistering }] =
    useRegisterMutation();
  const [loginMutation, { isLoading: isAutoLogin }] = useLoginMutation();
  const isSubmitting = isRegistering || isAutoLogin;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginWithPhone>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
    },
  });

  // Người dùng đã đăng ký trước đó -> tự động đăng nhập (username = password = SĐT)
  const autoLogin = async (phoneNumber: string) => {
    const res = await loginMutation({
      usernameOrEmail: phoneNumber,
      password: phoneNumber,
    }).unwrap();
    dispatch(
      login({
        accessToken: res.accessToken,
        userInfo: res.user,
        refreshToken: res.refreshToken,
      })
    );
    toast.success(t("auth.alreadyRegistered"));
    navigate("/menu");
  };

  const onSubmit = async (formData: LoginWithPhone) => {
    if (!tableInfo._id) {
      toast.error(t("auth.scanToRegister"));
      return;
    }

    try {
      const res = await registerMutation({
        username: formData.phoneNumber,
        password: formData.phoneNumber,
        phone: formData.phoneNumber,
        fulname: formData.fullName,
        role: "guest",
      }).unwrap();
      dispatch(login({ accessToken: res.accessToken, userInfo: res.user }));
      toast.success(t("auth.loginSuccess"));
      navigate("/menu");
    } catch (error) {
      // SĐT đã tồn tại -> đăng nhập luôn thay vì báo lỗi
      if (error && typeof error === "object" && "status" in error && error.status === 400) {
        try {
          await autoLogin(formData.phoneNumber);
        } catch (loginError) {
          console.log(loginError);
          toast.error(t("auth.phoneExistsShort"));
        }
      } else {
        console.log(error);
      }
    }
  };

  return (
    <div className="sm:w-[496px] absolute sm:top-14 sm:left-32 h-fit w-full top-5 flex justify-center ">
      <div className="flex flex-col items-center justify-center  w-[80vw] ">
        <p className="text-3xl font-bold mb-12 mt-7 text-white ">{t("auth.registerTitle")}</p>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <FormField<LoginWithPhone>
            className="mb-8"
            name="fullName"
            Icon={User}
            error={errors.fullName}
            control={control}
            type="text"
            placeholder={t("auth.fullName")}
          />
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
            disabled={isSubmitting}
            className="w-full py-3 text-white font-semibold bg-gradient-to-r from-primary-100 to-primary-400 rounded-lg hover:opacity-90 shadow-md transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t("common.processing") : t("auth.registerBtn")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;
