import { useEffect, useState } from "react";
import { Plus, Search, Trash2, Eye } from "lucide-react";
import Panigatation from "@/ui/Panigatation";
import {
  FoodItem,
  useDeleteMenuItemMutation,
  useGetAllMenuItemsQuery,
} from "@/service/menuItemApi";
import FoodDetail from "@/components/admin/FoodDetail";
import Loading from "@/components/Loading";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/Table";
import CreateDishForm from "@/components/admin/CreateDishForm";
import { socket } from "@/provider/SocketProvider";
import Alert from "@/components/Alert";
const ManagerFoods = () => {
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [foods, setFood] = useState<FoodItem[]>([]);
  const { data, isLoading, isSuccess, refetch } = useGetAllMenuItemsQuery();
  const [deleteMenuItem, { isSuccess: isDeleteSucces }] =
    useDeleteMenuItemMutation();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const ITEMS_PER_PAGE = 7;
  useEffect(() => {
    if (data?.result) {
      let filteredFoods = data.result;
      if (searchTerm) {
        filteredFoods = filteredFoods.filter((food) =>
          food.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      const startIndex = currentPage * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      setFood(filteredFoods.slice(startIndex, endIndex));
    }
  }, [isSuccess, data, currentPage, searchTerm]);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };
  useEffect(() => {
    socket.on("updateMenuItem", (data) => {
      console.log("updateMenuItem");
      if (data) {
        refetch();
      }
    });
    return () => {
      socket.off("updateMenuItem");
    };
  }, []);
  useEffect(() => {
    setFood(data?.result?.slice(0, 7) || []);
  }, [isSuccess, data]);

  useEffect(() => {
    if (isDeleteSucces) {
      toast.success("Xóa món ăn thành công");
    }
  }, [isDeleteSucces]);

  if (isLoading) {
    return <Loading />;
  }
  const openModal = (id: string) => {
    setSelectedFood(id);
    setShowModal(true);
  };

  return (
    <div className="w-full h-full">
      <div className="h-16 flex w-full justify-between items-center px-10 bg-gradient-to-r from-primary-100 to-primary-400">
        <h3 className="text-white font-bold text-xl">Quản lý món ăn</h3>
        <div className="flex flex-1 justify-center">
          <div className="flex gap-4 items-center bg-white rounded-xl px-2 py-1 w-[20vw] relative">
            <Search
              size={20}
              color="#6F767E"
              className="z-10 pointer-events-none"
            />
            <input
              placeholder="Tìm kiếm"
              className="text-sm px-5 py-1 border-none outline-none absolute w-full rounded-xl bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <button
          className="flex gap-1 py-1 px-3 items-center text-white border bg-primary-100 hover:bg-yellow-400 border-[#B38500] rounded-xl"
          onClick={() => setShowForm(true)}
        >
          <Plus size={20} />
          Thêm món
        </button>
      </div>

      <div className="p-6">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[10%]">STT</TableHead>
              <TableHead className="text-center w-[35%]">Tên món ăn</TableHead>
              <TableHead className="text-center w-[25%]">Loại món ăn</TableHead>
              <TableHead className="text-center w-[30%]">Chức năng</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {foods.map((food, index) => (
              <TableRow key={index} className="text-center">
                <TableCell>{index + 1}</TableCell>
                <TableCell>{food.name}</TableCell>
                <TableCell>{food.categoryName}</TableCell>
                <TableCell className="flex justify-center gap-3">
                  <div className="flex items-center gap-1 bg-[#ACACAC] hover:bg-slate-500 text-white px-3 py-1 rounded-2xl">
                    <Alert
                      btn1="Hủy"
                      btn2="Xóa"
                      description="Xóa món ăn khỏi dữ liệu của nhà hàng"
                      title="Bạn có chắc chắn xóa không?"
                      Icon={Trash2}
                      open="Xóa"
                      handleBtn2={async () => {
                        await deleteMenuItem({ id: food._id });
                      }}
                      handleBtn1={() => {}}
                    />
                  </div>
                  <button
                    onClick={() => openModal(food._id)}
                    className="flex items-center gap-1 bg-[#FBBC05] hover:bg-yellow-300 text-white px-3 py-1 rounded-2xl"
                  >
                    <Eye size={16} /> Xem chi tiết
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {showModal && selectedFood && (
        <FoodDetail setShowModal={setShowModal} id={selectedFood} />
      )}
      {showForm && (
        <CreateDishForm
          setShowForm={setShowForm} // set show form  = false
        />
      )}
      <Panigatation
        pageCount={Math.ceil((data?.result?.length || 0) / ITEMS_PER_PAGE)}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ManagerFoods;
