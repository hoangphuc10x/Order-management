import React, { useEffect } from "react";
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

const formSchema = yup.object().shape({
  phoneNumber: yup
    .string()
    .matches(/^(0|\+84)\d{9}$/, "Số điện thoại không hợp lệ")
    .required("Vui lòng nhập số điện thoại"),
});

const LoginUserPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tableInfo = useSelector((state: RootState) => state.table.tableInfo);

  const [loginMutation, { isSuccess, data, error, isError }] =
    useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<yup.InferType<typeof formSchema>>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const onSubmit = (formData: LoginWithPhone) => {
    try {
      console.log("data", formData);
      if (!tableInfo._id) {
        toast.error("Vui lòng quét mã tại bàn để đăng nhập!");
        return;
      }
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
      toast.success("Đăng nhập thành công!");
      navigate("/menu");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error && "status" in error && error.status === 404) {
      toast.error("Số điện thoại chưa được đăng ký!");
    }
  }, [isError]);

  return (
    <div className="sm:w-[496px] absolute sm:top-14 sm:left-32 h-fit w-full top-5 flex justify-center ">
      <div className="flex flex-col items-center justify-center  w-[80vw] ">
        <p className="text-3xl font-bold mb-12 mt-7 text-white ">
          Đăng Nhập
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <FormField<LoginWithPhone>
            className="mb-8"
            name="phoneNumber"
            Icon={Phone}
            error={errors.phoneNumber}
            control={control}
            type="text"
            placeholder="Số điện thoại"
          />
          <button
            type="submit"
            className="w-full py-3 text-white font-semibold bg-gradient-to-r from-primary-100 to-primary-400 rounded-lg hover:opacity-90 shadow-md transition-opacity"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginUserPage;
