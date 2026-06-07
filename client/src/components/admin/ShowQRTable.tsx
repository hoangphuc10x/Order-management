import { X } from "lucide-react";
import Loading from "../Loading";
import { useGetTableByIdQuery } from "@/service/tableApi";
interface TableDetailProps {
  setShowQRTable: (table: null | string) => void;
  id: string;
}

const ShowQRTable = ({ setShowQRTable, id }: TableDetailProps) => {
  const { data, isLoading } = useGetTableByIdQuery({ id });
  const tableData = data?.result;
  if (isLoading) {
    return <Loading />;
  }

  console.log('====================================');
  console.log("data", data);
  console.log('====================================');
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
      <div className="bg-white w-[900px] max-w-full h-[579px] shadow-lg overflow-auto mb-[80px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-100 to-primary-400  text-white text-lg font-bold h-[10%] p-4 flex justify-center items-center relative ">
          <span className="">Mã QR bàn {tableData?.tableNumber}</span>
          <X
            size={24}
            className="cursor-pointer absolute right-4"
            onClick={() => setShowQRTable(null)}
          />
        </div>
        {/* Body */}
        <div className="flex-1 flex justify-center items-center">
            <img src={tableData?.qrCode} alt="" className="w-[50%]"/>
        </div>
      </div>
    </div>
  );
};
export default ShowQRTable;
