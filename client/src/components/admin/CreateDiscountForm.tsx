import { useState } from "react";
import Alert from "../Alert";
import { useCreateDiscountMutation } from "@/service/adminAPI";
import { toast } from "sonner";

const CreateDiscountForm = ({
  setShowForm,
  refetch,
}: {
  setShowForm: (show: boolean) => void;
  refetch: () => void;
}) => {
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percentage" | "fixed">("percentage");
  const [value, setValue] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [minOrderValue, setMinOrderValue] = useState("");
  const [endDate, setEndDate] = useState(today);
  const [quantity, setQuantity] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [createDiscount] = useCreateDiscountMutation();

  const validateInputs = (): boolean => {
    const errs: Record<string, string> = {};

    if (!code.trim()) errs.code = "Mã giảm giá là bắt buộc.";
    if (type === "percentage" && Number(value) > 100) errs.value = "Giá trị phải bé hơn 100%.";


    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreate = async () => {
    if (!validateInputs()) return;

    const res = await createDiscount({
      code,
      type,
      value: Number(value),
      maxDiscount: Number(maxDiscount),
      minOrderValue: Number(minOrderValue),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      usageLimit: Number(quantity) || null,
    });
    if (res.data?.success) {
      refetch();
      setShowForm(false);
      setCode("");
      setType("percentage");
      setValue("");
      setMaxDiscount("");
      setMinOrderValue("");
      setStartDate(today);
      setEndDate(today);
      setQuantity("");
      toast.success("Tạo mã giảm giá thành công");
    } else {
      toast.error("Tạo mã giảm giá thất bại");
    }


  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center h-screen">
      <div className="bg-white w-[900px] max-w-full shadow-lg mb-[80px] mt-[91px]">
        <div className="bg-gradient-to-r from-primary-100 to-primary-400 p-3 flex items-center justify-between">
          <h2 className="text-white text-xl text-center flex-grow">Tạo mã</h2>
        </div>

        <div className="px-20 max-h-[600px] overflow-auto">
          <div className="mt-5 flex flex-col gap-5">
            {/* Code input */}
            <div className="flex flex-col items-start">
              <div className="flex gap-2 items-center w-full">
                <p>Tên mã:</p>
                <input
                  type="text"
                  value={code}
                  placeholder={errors.code ? errors.code : "Nhập mã giảm giá"}
                  onChange={(e) => setCode(e.target.value)}
                  className={`p-1 flex-1 border  rounded-lg ${
                    errors.code ? "border-red-500 " : "border-black"
                  }`}
                />
              </div>
            </div>

            <div className="flex">
              {/* Left column */}
              <div className="flex flex-col gap-5 flex-1">
                <div className="flex gap-2 items-center">
                  <p>Loại:</p>
                  <select
                    className="border border-secondary-100 rounded-lg p-1"
                    value={type}
                    onChange={(e) =>
                      setType(e.target.value as "percentage" | "fixed")
                    }
                  >
                    <option value="percentage">Giảm giá theo %</option>
                    <option value="fixed">Giảm giá theo VNĐ</option>
                  </select>
                </div>
                <div className="flex flex-col items-start">
                  <div className="flex gap-2 items-center w-full">
                    <p>Số tiền giảm tối đa:</p>
                    <input
                      type="text"
                      className={`p-1 border  rounded-lg ${
                        errors.maxDiscount ? "border-red-500 " : "border-black"
                      }`}
                      placeholder={
                        errors.maxDiscount ? errors.maxDiscount : "Tối đa"
                      }
                      value={maxDiscount}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) setMaxDiscount(val); // Chỉ nhận số nguyên không âm
                      }}
                    />
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <p>Ngày bắt đầu</p>
                  <input
                    type="date"
                    className="p-1 border border-black rounded-lg"
                    min={today}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Right column */}
              <div className="flex flex-col gap-5 flex-1">
                <div className="flex flex-col items-start">
                  <div className="flex gap-2 items-center w-full">
                    <p>Giá trị:</p>
                    <input
                      type="text"
                      className={`p-1 border  rounded-lg ${
                        errors.value ? "border-red-500 " : "border-black"
                      }`}
                      placeholder={errors.value ? errors.value : "Giá trị"}
                      value={value}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) setValue(val); // Chỉ nhận số nguyên không âm
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-start">
                  <div className="flex gap-2 items-center w-full">
                    <p>Áp dụng cho:</p>
                    <input
                      type="text"
                      className="flex-1 p-1 border border-black rounded-lg"
                      placeholder="Áp dụng cho đơn"
                      value={minOrderValue}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) setMinOrderValue(val); // Chỉ nhận số nguyên không âm
                      }}
                    />
                  </div>
                  {errors.minOrderValue && (
                    <p className="text-red-500 text-sm ml-[100px]">
                      {errors.minOrderValue}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 items-center">
                  <p>Ngày kết thúc</p>
                  <input
                    type="date"
                    className="p-1 border border-black rounded-lg"
                    min={startDate}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Quantity input */}
            <div className="flex flex-col items-start">
              <div className="flex gap-2 items-center w-full">
                <p>Số lượng:</p>
                <input
                  type="text"
                  className="p-1 flex-1 border border-black rounded-lg"
                  placeholder="Số lượng"
                  value={quantity}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val)) setQuantity(val); // Chỉ nhận số nguyên không âm
                  }}
                />
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-5 mb-11 ">
              <button
                onClick={() => setShowForm(false)}
                className="h-[32px] w-[100px] bg-white border border-[#FBBC05] rounded-2xl hover:bg-secondary-100"
              >
                Đóng
              </button>
              <div className="h-[32px] w-[100px] bg-[#FBBC05] text-white rounded-2xl flex justify-center items-center hover:bg-secondary-100">
                <Alert
                  open="Tạo"
                  btn1="Hủy"
                  btn2="Tạo mới"
                  description="Tạo mã giảm giá được thêm vào dữ liệu nhà hàng!"
                  title="Bạn có muốn tạo mã này không?"
                  handleBtn1={() => {}}
                  handleBtn2={handleCreate}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDiscountForm;
