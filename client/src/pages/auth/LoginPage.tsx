import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole, Mail } from "lucide-react";
import FormField from "../../components/FormField";
import Google from "../../icons/Google";
import { LoginFormData, useLoginMutation } from "@/service/rootApi";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/authSlice";
import { toast } from "sonner";

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formSchema = useMemo(
    () =>
      yup.object().shape({
        usernameOrEmail: yup
          .string()
          .required(t("auth.emailOrUsernameRequired"))
          .matches(/^\S+$/, t("auth.noWhitespace")),
        password: yup
          .string()
          .required(t("auth.passwordRequired"))
          .matches(/^\S+$/, t("auth.noWhitespace")),
      }),
    [t]
  );

  const [loginMutation, { isSuccess, data, error, isError }] =
    useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  const onSubmit = (formData: LoginFormData) => {
    try {
      console.log("data", formData);
      loginMutation(formData);
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
      if (data.user.role === "manager") {
        navigate("/dashboard");
      } else if (data.user.role === "staff") {
        navigate("/staff/show-table");
      } else {
        navigate("/chef/confirm-order");
      }
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error && "status" in error && error.status === 404) {
      toast.error(t("auth.loginFail"));
    }
  }, [isError]);
  return (
    <div className="flex flex-col items-center justify-center absolute h-fit top-5 left-0 w-full px-6 sm:w-[496px] sm:left-32 sm:top-14 sm:px-0">
      <p className="text-3xl font-bold mb-12 mt-7 text-white ">{t("auth.loginTitle")}</p>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        {/* <div className="mb-8 w-full h-14">
          <div className="relative w-full h-12">
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  {...field}
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 pl-10 text-black bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
              )}
            />
            <span className="absolute left-2 top-3 text-gray-400 "><Mail /></span>
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
          )}
        </div> */}
        <FormField<LoginFormData>
          className="mb-8"
          name="usernameOrEmail"
          Icon={Mail}
          error={errors.usernameOrEmail}
          control={control}
          type="text"
          placeholder={t("auth.usernameOrEmail")}
        />
        <FormField<LoginFormData>
          className="mb-4"
          name="password"
          Icon={LockKeyhole}
          error={errors.password}
          control={control}
          type="password"
          placeholder={t("auth.password")}
        />
        <div className="text-right  mb-7">
          <a
            href="#"
            className="text-gray-200 hover:text-white hover:underline"
          >
            {t("auth.forgotPassword")}
          </a>
        </div>

        <button
          type="submit"
          className="w-full py-3 text-white font-semibold bg-gradient-to-r from-primary-100 to-primary-400 rounded-lg hover:opacity-90 shadow-md transition-opacity"
        >
          {t("auth.loginBtn")}
        </button>
      </form>
      <Link
        to="/register/admin"
        className="text-xl text-gray-200 hover:text-white my-7 "
      >
        {t("auth.goRegister")}
      </Link>
      <span className="text-sm text-gray-300 mb-7">
        {t("auth.linkAccount")}
      </span>
      <Link
        to=""
        className="w-full bg-white rounded-lg py-2 text-primary gap-2 justify-center flex border-2 border-yellow-400 "
      >
        <Google />
        {t("auth.continueGoogle")}
      </Link>
    </div>
  );
};

export default LoginPage;
