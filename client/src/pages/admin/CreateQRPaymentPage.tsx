import { Search } from "lucide-react";

const CreateQRPaymentPage = () => {
  return (
    <div className="size-full">
      <div className="h-16 flex w-full items-center px-10 bg-gradient-to-r from-primary-100 to-primary-400">
        <h3 className="text-white font-bold text-xl">Tạo QR thanh toán</h3>
        <div className="flex flex-1 justify-center">
          <div className="flex gap-4 items-center bg-white rounded-xl px-2 py-1 w-[20vw]">
            <Search size={20} color="#6F767E" />
            <input
              placeholder="Tìm kiếm"
              className="text-sm px-2 py-1 border-none outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQRPaymentPage;
