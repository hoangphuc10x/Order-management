import { useCreateTableMutation } from "@/service/tableApi";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Alert from "../Alert";
import { useTranslation } from "react-i18next";

interface CreateTableFormProps {
  setShowFormCreateTable: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateTable: React.FC<CreateTableFormProps> = ({
  setShowFormCreateTable,
}) => {
  const { t } = useTranslation();
  const [createTable, { isSuccess, reset }] = useCreateTableMutation();
  const [newTable, setNewTable] = useState<string>("");

  const handleCreateTable = (tableNumber: string) => {
    createTable({ tableNumber });
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success(t("createTable.createSuccess"));
      setShowFormCreateTable(false);
      reset();
    }
  }, [isSuccess, setShowFormCreateTable, reset]);
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center h-screen">
      <div className="bg-white w-[900px] max-w-[95vw] h-[335px] max-w-full shadow-lg overflow-auto mb-[80px] mt-[91px]">
        <div className="bg-gradient-to-r from-primary-100 to-primary-400 p-3 flex items-center justify-between">
          <h2 className="text-white text-xl text-center flex-grow">{t("createTable.title")}</h2>
        </div>
        <div className="px-[127px]">
          <div className="mt-5">
            <div>
              <p>{t("createTable.nameLabel")}</p>
              <input
                type="text"
                placeholder={t("createTable.namePlaceholder")}
                className="w-full p-3 mb-2 border border-black rounded-lg"
                value={newTable}
                onChange={(e) => setNewTable(e.target.value)}
              />
            </div>
            <div className="flex justify-center gap-2 mt-5 mb-11">
              <button
                onClick={() => setShowFormCreateTable(false)}
                className="h-[32px] w-[100px] bg-white border border-[#7C3AED] hover:bg-yellow-500 rounded-2xl"
              >
                {t("common.close")}
              </button>
              <div className="h-[32px] w-[100px] bg-[#7C3AED] hover:bg-yellow-600 text-white rounded-2xl flex justify-center items-center">
                <Alert
                  open={t("createTable.create")}
                  btn1={t("common.cancel")}
                  btn2={t("createTable.createBtn")}
                  description={t("createTable.confirmDesc")}
                  title={t("createTable.confirmTitle")}
                  handleBtn1={() => {}}
                  handleBtn2={() => handleCreateTable(newTable)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTable;
