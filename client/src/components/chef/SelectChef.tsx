import {
  useChooseChefForCookingMutation,
  useGetAllChefForCookingQuery,
} from "@/service/kitchenApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/Table";
import { toast } from "sonner";
import Alert from "../Alert";


interface Order{
  orderItemIds: string[];

}

const SelectChef = ({
  setIsModalOpenChef,
  order,
}: {
  setIsModalOpenChef: (value: boolean) => void;
  order: Order;
}) => {
  const { data, refetch } = useGetAllChefForCookingQuery();
  const [chooseChef] = useChooseChefForCookingMutation();

  const handleChooseChef = async (id: string) => {
    try {
      await chooseChef({
        userId: id,
        orderItemIds: order.orderItemIds,
      }).unwrap();
      refetch();
      setIsModalOpenChef(false)
      toast.success("Giao món thành công");
    } catch {
      toast.error("Giao món không thành công");
    }
  };


  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
      <div className="bg-white w-[900px] max-w-full h-[579px] shadow-lg overflow-auto mb-[80px] fixed top-0 left-1/2 transform -translate-x-1/2 z-50 mt-10 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-100 to-primary-400 text-white text-lg font-bold h-[65px] p-4 flex justify-center items-center sticky top-0 z-10">
          <p>Chọn nhân viên</p>
        </div>

        {/* Modal Body */}
        <div className="p-10 text-lg flex flex-col items-center text-center overflow-y-auto flex-1">
          <div className="w-full">
            <Table className="w-full">
              <TableHeader className="text-sm text-black">
                <TableRow>
                  <TableHead className="p-2 w-[5%] text-center">STT</TableHead>
                  <TableHead className="p-2 w-[10%] text-center">
                    Tên bếp
                  </TableHead>
                  <TableHead className="p-2 w-[5%] text-center">
                    Trạng thái
                  </TableHead>
                  <TableHead className="p-2 w-[10%] text-center">
                    Chức năng
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((chef, index) => (
                  <TableRow key={chef._id} className="text-center">
                    <TableCell className="p-2">{index + 1}</TableCell>
                    <TableCell className="p-2">{chef.fulname}</TableCell>
                    <TableCell className="p-2">{chef.status}</TableCell>
                    <TableCell className="p-2 t">
                      <div className="w-full justify-center flex">
                        <Alert
                          open="Giao món"
                          btn1="Hủy"
                          btn2="Đồng ý"
                          description="Chọn đầu bếp để nấu món!"
                          title="Chọn đầu bếp này?"
                          handleBtn1={() => {}}
                          handleBtn2={() => handleChooseChef(chef._id)}
                          disabled={chef.status !== "STANDBY"}
                          className={`text-white !w-fit  px-3 py-1 rounded-xl whitespace-nowrap ${
                            chef.status !== "STANDBY"
                              ? "bg-slate-400"
                              : "bg-primary-100"
                          }`}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-2 flex justify-center mt-auto">
          <button
            className="h-8 w-[100px] text-black border border-yellow-500 rounded-2xl hover:bg-yellow-500 hover:text-white transition"
            onClick={() => setIsModalOpenChef(false)}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectChef;
