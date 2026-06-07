import { Link, useNavigate } from "react-router-dom";
import Logo from "@/icons/Logo";
import { Table } from "@/service/tableApi";
import Loading from "../Loading";
import { EllipsisVertical } from "lucide-react";
import { useGetTableOccupiedQuery } from "@/service/kitchenApi";
import { useEffect } from "react";
import { socket } from "@/provider/SocketProvider";
import { toast } from "sonner";


interface HeadingChefProps {
  isOpen: boolean;
  handleToggleNavbar: () => void;
}

const HeadingChef: React.FC<HeadingChefProps> = () => {
  const navigate = useNavigate();
  const { data = { success: false, data: [] }, isLoading, refetch } =
    useGetTableOccupiedQuery();



  useEffect(() => {
    socket.on("table:long-waiting", (data) => {
      console.log("table:long-waiting", data);
      if (data) {
        refetch();
        toast.warning(data.message);
      }
    });

    return () => {
      socket.off("table:long-waiting");
    };
  }, []);

  const tableList = [...data.data].sort((a: Table, b: Table) => {
    return Number(b.inform) - Number(a.inform);
  })


  if (isLoading) {
    return <Loading />;
  }

  return (
    <header className="bg-yellow-400 shadow w-screen h-[64px] pl-20 pr-4">
      <div className=" flex gap-2 items-center border-b border-b-[#E9EAEC] h-full w-full">
        <Link to={"/chef/confirm-order"} className="">
          <Logo className="" fill="white" />
        </Link>
        <span className=" text-xl font-bold ml-28 w-20">Số bàn</span>
        <div
          className="flex items-center gap-4  w-full flex-1 overflow-x-auto "
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex gap-2 py-2 flex-1 cursor-pointer ">
            {tableList.length> 0 ? (
              tableList.map((table: Table) => (
                <span
                  key={table._id}
                  onClick={() =>
                    navigate(`/chef/table/${table._id}`, {
                      state: { tableName: table.tableNumber },
                    })
                  }
                  className={` px-2 py-2 rounded-lg border-2 border-yellow-600 hover:bg-yellow-300 w-20 flex justify-center 
                    ${table.inform ? "bg-red-500" : "bg-yellow-200"}`}
                >
                  {table.tableNumber}
                </span>
              ))
            ) : (
              <span className="text-gray-700 italic">Không có bàn nào!!</span>
            )}
          </div>
        </div>
        <Link
          to="/chef/table"
          className="btn border-2 !border-black !text-black w-fit"
        >
          <EllipsisVertical />
        </Link>
      </div>
    </header>
  );
};

export default HeadingChef;
