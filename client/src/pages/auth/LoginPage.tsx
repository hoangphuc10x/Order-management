import React, { useEffect } from "react";
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

const formSchema = yup.object().shape({
  usernameOrEmail: yup
    .string()
    .required("Vui lòng nhập email hoặc username")
    .matches(/^\S+$/, "Không được chứa khoảng trắng"),
  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .matches(/^\S+$/, "Không được chứa khoảng trắng"),
});

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginMutation, { isSuccess, data, error, isError }] =
    useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<yup.InferType<typeof formSchema>>({
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
      toast.success("Đăng nhập thành công!");
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
      toast.error("Tên đặng nhập hoặc Email hoặc mật khẩu không đúng!");
    }
  }, [isError]);
  return (
    <div className="flex flex-col items-center justify-center w-[496px] absolute top-14 left-32 h-fit ">
      <p className="text-3xl font-bold mb-12 mt-7 text-white ">Đăng Nhập</p>
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
          placeholder="Email hoặc tên đăng nhập"
        />
        <FormField<LoginFormData>
          className="mb-4"
          name="password"
          Icon={LockKeyhole}
          error={errors.password}
          control={control}
          type="password"
          placeholder="Mật khẩu"
        />
        <div className="text-right  mb-7">
          <a
            href="#"
            className="text-gray-200 hover:text-white hover:underline"
          >
            Quên mật khẩu?
          </a>
        </div>

        <button
          type="submit"
          className="w-full py-3 text-white font-semibold bg-gradient-to-r from-primary-100 to-primary-400 rounded-lg hover:opacity-90 shadow-md transition-opacity"
        >
          Đăng nhập
        </button>
      </form>
      <Link
        to="/register/admin"
        className="text-xl text-gray-200 hover:text-white my-7 "
      >
        Đăng ký tài khoản
      </Link>
      <span className="text-sm text-gray-300 mb-7">
        Liên kết tài khoản của bạn để tiếp tục sử dụng dịch vụ
      </span>
      <Link
        to=""
        className="w-full bg-white rounded-lg py-2 text-primary gap-2 justify-center flex border-2 border-yellow-400 "
      >
        <Google />
        Tiếp tục với Google
      </Link>
    </div>
  );
};

export default LoginPage;
