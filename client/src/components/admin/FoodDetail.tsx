import {
  useGetMenuItemByIdQuery,
  useUpdateMenuItemMutation,
} from "@/service/menuItemApi";
import { useEffect, useState } from "react";
import Loading from "../Loading";
import ImageUpload from "./ImageUpload";
import { toast } from "sonner";
import { useGetAllCategoriesQuery } from "@/service/categoryApi";
import Alert from "../Alert";

interface FoodDetailProps {
  setShowModal: (value: boolean) => void;
  id: string;
}

const FoodDetail: React.FC<FoodDetailProps> = ({ setShowModal, id }) => {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [category, setCategory] = useState<{
    categoryId: string;
    categoryName: string;
  } | null>({
    categoryId: "",
    categoryName: "",
  });
  const [imageUrl, setImageUrl] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [difficultyLevel, setDifficultyLevel] = useState<number>(1);
  const [readyToServeItems, setReadyToServeItems] = useState<boolean>(false);
  const { data, isSuccess, isLoading } = useGetMenuItemByIdQuery({
    id,
  });
  const { data: categoryAll } = useGetAllCategoriesQuery();
  const [updateMenuItem, { isLoading: isUpdating }] =
    useUpdateMenuItemMutation();

  useEffect(() => {
    if (isSuccess) {
      setName(data?.result?.name || "");
      setPrice(data?.result?.price?.$numberDecimal || "");
      setCategory({
        categoryId: data.result.category.categoryId,
        categoryName: data.result.category.categoryName,
      });
      setDescription(data?.result?.description || "");
      setImageUrl(data?.result?.imageUrl || "");
      setDifficultyLevel(data?.result?.difficultyLevel || 1);
      setReadyToServeItems(data?.result?.readyToServeItems || false);
    }
  }, [isSuccess, data]);

  console.log(data, "data line 30");

  const handleSave = async () => {
    try {
      await updateMenuItem({
        id,
        name,
        price: parseFloat(price),
        category: {
          categoryId: category?.categoryId || "",
          categoryName: category?.categoryName || "",
        },
        imageUrl,
        description,
        difficultyLevel,
        readyToServeItems,
      });
      setIsEditing(false); // Sau khi lưu, chuyển về chế độ xem
      toast.success("Cập nhật món thành công!"); // Thông báo thành công
    } catch (error) {
      console.error("Failed to update food item:", error);
      toast.error("Cập nhật món ăn thất bại. Vui lòng thử lại."); // Thông báo lỗi
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  console.log("cate line 65", category);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center ">
      <div className="bg-white w-[800px] max-w-[95vw] max-w-full h-[650px] shadow-lg flex flex-col mb-[80px]  mt-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-100 to-primary-400 text-white text-lg font-bold h-[65px] p-4 flex justify-center items-center">
          <p>Chi tiết món ăn</p>
        </div>

        {/* Body */}
        <div
          className="p-6 space-y-6 overflow-y-scroll flex-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="space-y-4">
            <div>
              <strong>Tên món ăn:</strong>
              <input
                type="text"
                className="w-full p-2 border rounded-lg mt-2"
                disabled={!isEditing}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <strong>Giá tiền:</strong>
              <input
                type="text"
                className="w-full p-2 border rounded-lg mt-2"
                disabled={!isEditing}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div>
              <strong>Loại món ăn:</strong>
              <select
                className="w-full p-3 border rounded-lg"
                value={category?.categoryId || ""}
                onChange={(e) => {
                  const selectedCategory = categoryAll?.result.find(
                    (cat) => cat._id === e.target.value
                  );
                  if (selectedCategory) {
                    setCategory({
                      categoryId: selectedCategory._id,
                      categoryName: selectedCategory.name,
                    });
                  }
                }}
                disabled={!isEditing}
              >
                {(categoryAll?.result ?? []).length > 0 ? (
                  categoryAll?.result.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))
                ) : (
                  <option value="">Không có danh mục</option>
                )}
              </select>
            </div>

            <div>
              <strong>Mức độ khó:</strong>
              <select
                className="w-full p-3 border rounded-lg mt-2"
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(Number(e.target.value))}
                disabled={!isEditing}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>

            <div>
              <strong>Mô tả:</strong>
              <textarea
                className="w-full p-2 border rounded-lg "
                disabled={!isEditing}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Image Section */}
          <div className="flex gap-10">
            <div>
              <strong>Ảnh:</strong>
              {isEditing ? (
                <ImageUpload setImageUrl={setImageUrl} imageUrl={imageUrl} />
              ) : (
                <img
                  src={imageUrl}
                  alt="Ảnh món ăn"
                  className="size-[200px] object-cover rounded-lg border border-gray-300"
                />
              )}
            </div>
            <div className="mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={readyToServeItems}
                  onChange={(e) => setReadyToServeItems(e.target.checked)}
                  className="w-5 h-5"
                  defaultChecked={readyToServeItems}
                  disabled={!isEditing}
                />
                <span>Sẵn sàng để ra món</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 flex justify-center gap-4">
          <button
            className="h-10 w-[120px] text-black border border-yellow-500 rounded-2xl hover:bg-yellow-500 hover:text-white transition"
            onClick={() => setShowModal(false)}
          >
            Đóng
          </button>
          {isEditing ? (
            <div className="h-10 w-[120px] text-black border border-yellow-500 rounded-2xl hover:bg-yellow-500 hover:text-white  flex justify-center items-center transition">
              <Alert
                open={isUpdating ? "Đang lưu..." : "Lưu lại"}
                btn1="Hủy"
                btn2="Lưu"
                description="Chỉnh sửa dữ liệu món ăn của nhà hàng"
                title="Bạn có chắc lưu không?"
                handleBtn2={handleSave}
                handleBtn1={() => {}}
              />
            </div>
          ) : (
            <button
              className="h-10 w-[120px] text-black border border-yellow-500 bg-yellow-400 rounded-2xl hover:bg-yellow-500 hover:text-white transition"
              onClick={() => setIsEditing(true)}
            >
              Chỉnh sửa
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
