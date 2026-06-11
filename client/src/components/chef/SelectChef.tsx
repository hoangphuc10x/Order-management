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
import { useTranslation } from "react-i18next";


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
  const { t } = useTranslation();
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
      toast.success(t("chef.deliverSuccess"));
    } catch {
      toast.error(t("chef.deliverFail"));
    }
  };


  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
      <div className="bg-white w-[900px] max-w-[95vw] max-w-full h-[579px] shadow-lg overflow-auto mb-[80px] fixed top-0 left-1/2 transform -translate-x-1/2 z-50 mt-10 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-100 to-primary-400 text-white text-lg font-bold h-[65px] p-4 flex justify-center items-center sticky top-0 z-10">
          <p>{t("chef.selectStaff")}</p>
        </div>

        {/* Modal Body */}
        <div className="p-10 text-lg flex flex-col items-center text-center overflow-y-auto flex-1">
          <div className="w-full">
            <Table className="w-full">
              <TableHeader className="text-sm text-black">
                <TableRow>
                  <TableHead className="p-2 w-[5%] text-center">{t("table.stt")}</TableHead>
                  <TableHead className="p-2 w-[10%] text-center">
                    {t("chef.chefName")}
                  </TableHead>
                  <TableHead className="p-2 w-[5%] text-center">
                    {t("table.status")}
                  </TableHead>
                  <TableHead className="p-2 w-[10%] text-center">
                    {t("table.actions")}
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
                          open={t("chef.deliver")}
                          btn1={t("common.cancel")}
                          btn2={t("common.agree")}
                          description={t("chef.selectChefDesc")}
                          title={t("chef.selectChefTitle")}
                          handleBtn1={() => {}}
                          handleBtn2={() => handleChooseChef(chef._id)}
                          disabled={
                            chef.status !== "STANDBY" &&
                            chef.status !== "COOKING"
                          }
                          className={`text-white !w-fit  px-3 py-1 rounded-xl whitespace-nowrap ${
                            chef.status !== "STANDBY" &&
                            chef.status !== "COOKING"
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
            {t("common.close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectChef;
