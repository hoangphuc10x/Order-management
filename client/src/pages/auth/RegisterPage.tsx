import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { FolderPen, LockKeyhole, Mail, Phone } from "lucide-react";
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
}

const formSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email")
    .matches(/^\S+$/, "Không được chứa khoảng trắng"),
  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .matches(/^\S+$/, "Không được chứa khoảng trắng"),
  confirmPassword: yup
    .string()
    .required("Vui lòng xác nhận mật khẩu")
    .oneOf([yup.ref("password")], "Mật khẩu không khớp"),
  username: yup
    .string()
    .required("Vui lòng nhập tên tài khoản")
    .matches(/^\S+$/, "Không được chứa khoảng trắng"),
  phone: yup
    .string()
    .matches(/^(0|\+84)\d{9}$/, "Số điện thoại không hợp lệ")
    .required("Vui lòng nhập số điện thoại"),
  fulname: yup.string().required("Vui lòng nhập họ tên"),
});

interface Err {
  data: {
    error: string;
  };
  status: number;
}

const RegisterPage = () => {
  const [registerMutation] = useRegisterMutation();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(formSchema),
  });

  const onSubmit = async (formData: RegisterFormData) => {
    try {
      console.log("data", formData);
      const res = await registerMutation({
        username: formData.username,
        password: formData.password,
        phone: formData.phone,
        role: "manager",
        email: formData.email,
        fulname: formData.fulname,
      }).unwrap();

      if (res.user) {
        toast.success("Đăng ký thành công");
        navigate("/login/admin");
      }
    } catch (e: unknown) {
      const error = e as Err;
      if (error.data.error === "Phone of user is already exist") {
        toast.error("Số điện thoại đã tồn tại! Vui lòng nhập số khác");
      } else if (error.data.error === "UserName is already exist") {
        toast.error("Tên tài khoản đã tồn tại! Vui lòng nhập tên khác");
      } else if (error.data.error === "Email is already exist") {
        toast.error("Email đã tồn tại! Vui lòng nhập email khác");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-[496px] absolute top-4 left-32 h-fit">
      <p className="text-3xl font-bold mb-12 mt-7 text-[#FBBC05]">Đăng Ký</p>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <FormField
          className="mb-4 "
          name="fulname"
          Icon={FolderPen}
          error={errors.fulname}
          control={control}
          type="text"
          placeholder="Tên đầy đủ"
        />
        <div className="flex gap-2 mb-4">
          <FormField
            name="username"
            Icon={FolderPen}
            error={errors.username}
            control={control}
            type="text"
            placeholder="Tên tài khoản"
          />
          <FormField
            name="phone"
            Icon={Phone}
            error={errors.phone}
            control={control}
            type="text"
            placeholder="Số điện thoại"
          />
        </div>
        <FormField
          className="mb-4"
          name="email"
          Icon={Mail}
          error={errors.email}
          control={control}
          type="email"
          placeholder="Email"
        />
        <FormField
          className="mb-4"
          name="password"
          Icon={LockKeyhole}
          error={errors.password}
          control={control}
          type="password"
          placeholder="Mật khẩu"
        />
        <FormField
          className="mb-4"
          name="confirmPassword"
          Icon={LockKeyhole}
          error={errors.confirmPassword}
          control={control}
          type="password"
          placeholder="Xác nhận mật khẩu"
        />
        <button
          type="submit"
          className="w-full py-3 text-black/75 bg-yellow-500 rounded-lg hover:bg-yellow-600 transition"
        >
          Đăng Ký
        </button>
      </form>
      <Link
        to="/login/admin"
        className="text-xl bg-gradient-to-r from-primary-100 to-[#FF6200] bg-clip-text text-transparent my-4"
      >
        Quay lại đăng nhập
      </Link>
      <span className="text-sm text-primary-100 mb-7">
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

export default RegisterPage;
