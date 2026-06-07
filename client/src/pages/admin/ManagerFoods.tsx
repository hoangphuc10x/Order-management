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
import CreateDishForm from "@/components/admin/CreateDishForm";
import { socket } from "@/provider/SocketProvider";
import Alert from "@/components/Alert";
import Reveal from "@/components/Reveal";
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

  const ITEMS_PER_PAGE = 12;
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
    setFood(data?.result?.slice(0, ITEMS_PER_PAGE) || []);
  }, [isSuccess, data]);

  // Quay về trang đầu khi thay đổi từ khóa tìm kiếm
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  const totalCount = data?.result
    ? searchTerm
      ? data.result.filter((food) =>
          food.name.toLowerCase().includes(searchTerm.toLowerCase())
        ).length
      : data.result.length
    : 0;

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
          className="flex gap-1 py-1.5 px-4 items-center text-white border bg-primary-100 hover:bg-yellow-400 border-[#6D28D9] rounded-xl transition-colors"
          onClick={() => setShowForm(true)}
        >
          <Plus size={20} />
          Thêm món mới
        </button>
      </div>

      <div className="p-6">
        {foods.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Search size={48} className="mb-3" />
            <p className="text-lg">Không tìm thấy món ăn nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {foods.map((food, index) => (
              <Reveal
                key={food._id}
                delay={(index % 4) * 0.07}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-gray-100 transition-all duration-200 hover:-translate-y-1"
              >
                <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                  <img
                    src={food.imageUrl || "https://placehold.co/600x400?text=No+Image"}
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span
                    className={`absolute top-2 right-2 px-2 py-0.5 text-xs font-medium rounded-full text-white ${
                      food.isAvailable ? "bg-green-500" : "bg-gray-400"
                    }`}
                  >
                    {food.isAvailable ? "Còn bán" : "Tạm ngừng"}
                  </span>
                </div>

                <div className="flex flex-col flex-1 p-4">
                  <span className="inline-block w-fit text-xs font-medium text-primary-100 bg-secondary-100 px-2 py-0.5 rounded-full mb-2">
                    {food.categoryName}
                  </span>
                  <h4 className="font-bold text-gray-800 line-clamp-1" title={food.name}>
                    {food.name}
                  </h4>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1 flex-1">
                    {food.description}
                  </p>

                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={() => openModal(food._id)}
                      className="flex flex-1 items-center justify-center gap-1 bg-[#7C3AED] hover:bg-yellow-400 text-white px-3 py-1.5 rounded-xl text-sm transition-colors"
                    >
                      <Eye size={16} /> Chi tiết
                    </button>
                    <div className="flex items-center justify-center bg-[#ACACAC] hover:bg-red-500 text-white w-9 h-9 rounded-xl transition-colors">
                      <Alert
                        btn1="Hủy"
                        btn2="Xóa"
                        description="Xóa món ăn khỏi dữ liệu của nhà hàng"
                        title="Bạn có chắc chắn xóa không?"
                        Icon={Trash2}
                        open=""
                        handleBtn2={async () => {
                          await deleteMenuItem({ id: food._id });
                        }}
                        handleBtn1={() => {}}
                      />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
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
        pageCount={Math.ceil(totalCount / ITEMS_PER_PAGE)}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ManagerFoods;
