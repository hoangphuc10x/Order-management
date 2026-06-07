import Loading from "@/components/Loading";
import ManageTableIcon from "@/icons/ManageTableIcon";
import { useGetAllTablesQuery } from "@/service/tableApi";
import { useNavigate } from "react-router-dom";

const TableShowAll = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetAllTablesQuery();

  const tables =
    data?.result.filter((table) => table.status === "OCCUPIED") || [];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div
      className="flex-1 grid grid-cols-6 gap-4 max-h-[80vh] overflow-y-scroll"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {tables.map((table) => (
        <button
          onClick={() =>
            navigate(`/chef/table/${table._id}`, {
              state: { tableName: table.tableNumber },
            })
          }
          key={table._id}
          className="p-1 flex flex-col justify-center items-center w-[10vw] h-[12vh] relative border rounded-lg border-[#B38500] cursor-pointer   bg-primary-500 hover:bg-yellow-300"
        >
          <div className="absolute size-10 rounded-lg bg-primary-100  flex justify-center items-center top-1 left-1">
            <h3 className="text-xs text-white">{table.tableNumber}</h3>
          </div>
          <div>
            <ManageTableIcon />
          </div>
        </button>
      ))}
    </div>
  );
};

export default TableShowAll;
