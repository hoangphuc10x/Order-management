import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { Phone } from "lucide-react";
import FormField from "../../components/FormField";
import { useRegisterMutation } from "@/service/rootApi";
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

const RegisterUser: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tableInfo = useSelector((state: RootState) => state.table.tableInfo);

  const [registerMutation, { isSuccess, data, error, isError }] =
    useRegisterMutation();

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
        toast.error("Vui lòng quét mã tại bàn !");
        return;
      }
      registerMutation({
        username: formData.phoneNumber,
        password: formData.phoneNumber,
        phone: formData.phoneNumber,
        role: "guest",
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      console.log("đăng nhập thành công");
      dispatch(login({ accessToken: data.accessToken, userInfo: data.user }));
      toast.success("Đăng nhập thành công!");
      navigate("/menu");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error && "status" in error && error.status === 400) {
      toast.error("Số điện thoại đã tồn tại!");
    }
  }, [isError]);

  return (
    <div className="sm:w-[496px] absolute sm:top-14 sm:left-32 h-fit w-full top-5 flex justify-center ">
      <div className="flex flex-col items-center justify-center  w-[80vw] ">
        <p className="text-3xl font-bold mb-12 mt-7 text-[#FBBC05] ">Đăng Ký</p>
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
            className="w-full py-3 text-black/75 bg-yellow-500 rounded-lg hover:bg-yellow-600 transition"
          >
            Đăng Ký
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;
