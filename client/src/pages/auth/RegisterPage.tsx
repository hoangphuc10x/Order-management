import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { BriefcaseBusiness, FolderPen, LockKeyhole, Mail, Phone } from "lucide-react";
import FormField from "../../components/FormField";
import Google from "../../icons/Google";
import { useRegisterMutation } from "@/service/rootApi";
import { toast } from "sonner";

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  phone: string;
  fulname: string;
  role: "staff" | "chef";
}

interface Err {
  data: {
    error: string;
  };
  status: number;
}

const RegisterPage = () => {
  const { t } = useTranslation();
  const [registerMutation] = useRegisterMutation();
  const navigate = useNavigate();

  const formSchema = useMemo(
    () =>
      yup.object().shape({
        email: yup
          .string()
          .email(t("auth.emailInvalid"))
          .required(t("auth.emailRequired"))
          .matches(/^\S+$/, t("auth.noWhitespace")),
        password: yup
          .string()
          .required(t("auth.passwordRequired"))
          .matches(/^\S+$/, t("auth.noWhitespace")),
        confirmPassword: yup
          .string()
          .required(t("auth.confirmPasswordRequired"))
          .oneOf([yup.ref("password")], t("auth.passwordMismatch")),
        username: yup
          .string()
          .required(t("auth.usernameRequired"))
          .matches(/^\S+$/, t("auth.noWhitespace")),
        phone: yup
          .string()
          .matches(/^(0|\+84)\d{9}$/, t("auth.phoneInvalid"))
          .required(t("auth.phoneRequired")),
        fulname: yup.string().required(t("auth.fullNameRequired")),
        role: yup
          .string()
          .oneOf(["staff", "chef"], t("auth.roleInvalid"))
          .required(t("auth.roleRequired")),
      }),
    [t]
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: { role: "staff" },
  });

  const onSubmit = async (formData: RegisterFormData) => {
    try {
      console.log("data", formData);
      const res = await registerMutation({
        username: formData.username,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
        email: formData.email,
        fulname: formData.fulname,
      }).unwrap();

      if (res.user) {
        toast.success(t("auth.registerSuccess"));
        navigate("/login/admin");
      }
    } catch (e: unknown) {
      const error = e as Err;
      if (error.data.error === "Phone of user is already exist") {
        toast.error(t("auth.phoneExists"));
      } else if (error.data.error === "UserName is already exist") {
        toast.error(t("auth.usernameExists"));
      } else if (error.data.error === "Email is already exist") {
        toast.error(t("auth.emailExists"));
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center absolute h-fit top-4 left-0 w-full px-6 sm:w-[496px] sm:left-32 sm:px-0">
      <p className="text-3xl font-bold mb-12 mt-7 text-white">{t("auth.registerTitle")}</p>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <FormField
          className="mb-4 "
          name="fulname"
          Icon={FolderPen}
          error={errors.fulname}
          control={control}
          type="text"
          placeholder={t("auth.fullName")}
        />
        <div className="flex gap-2 mb-4">
          <FormField
            name="username"
            Icon={FolderPen}
            error={errors.username}
            control={control}
            type="text"
            placeholder={t("auth.username")}
          />
          <FormField
            name="phone"
            Icon={Phone}
            error={errors.phone}
            control={control}
            type="text"
            placeholder={t("auth.phone")}
          />
        </div>
        <FormField
          className="mb-4"
          name="email"
          Icon={Mail}
          error={errors.email}
          control={control}
          type="email"
          placeholder={t("auth.email")}
        />
        <div className="mb-4 w-full">
          <div className="relative w-full h-12">
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-4 py-3 pl-10 text-black bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none appearance-none"
                >
                  <option value="staff">{t("roles.staff")}</option>
                  <option value="chef">{t("auth.roleChef")}</option>
                </select>
              )}
            />
            <span className="absolute left-2 top-3 text-gray-400">
              <BriefcaseBusiness />
            </span>
          </div>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
          )}
        </div>
        <FormField
          className="mb-4"
          name="password"
          Icon={LockKeyhole}
          error={errors.password}
          control={control}
          type="password"
          placeholder={t("auth.password")}
        />
        <FormField
          className="mb-4"
          name="confirmPassword"
          Icon={LockKeyhole}
          error={errors.confirmPassword}
          control={control}
          type="password"
          placeholder={t("auth.confirmPassword")}
        />
        <button
          type="submit"
          className="w-full py-3 text-white font-semibold bg-gradient-to-r from-primary-100 to-primary-400 rounded-lg hover:opacity-90 shadow-md transition-opacity"
        >
          {t("auth.registerBtn")}
        </button>
      </form>
      <Link
        to="/login/admin"
        className="text-xl text-gray-200 hover:text-white my-4"
      >
        {t("auth.backToLogin")}
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

export default RegisterPage;
