import { useState } from "react";
import { useCreateMenuItemMutation } from "@/service/menuItemApi";
import { useGetAllCategoriesQuery } from "@/service/categoryApi";
import Loading from "../Loading";
import { toast } from "sonner";
import ImageUpload from "./ImageUpload";
import Alert from "../Alert";
interface CreateDishFormProps {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateDishForm: React.FC<CreateDishFormProps> = ({ setShowForm }) => {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [difficultyLevel, setDifficultyLevel] = useState<number>(1);
  const [readyToServeItems, setReadyToServeItems] = useState<boolean>(false);
  const { data, isLoading } = useGetAllCategoriesQuery();
  const [createMenuItem] = useCreateMenuItemMutation();

  if (isLoading) {
    return <Loading />;
  }

  const handleCreateDish = () => {
    if (!name.trim() || !price.trim() || !description.trim()) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (!categoryId) {
      toast.error("Vui lòng chọn loại món ăn.");
      return;
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      toast.error("Giá món ăn phải là số dương hợp lệ.");
      return;
    }

    createMenuItem({
      name,
      price: numericPrice,
      description,
      imageUrl,
      category: { categoryId },
      difficultyLevel,
      readyToServeItems,
    })
      .unwrap()
      .then((response) => {
        console.log("Tạo món ăn thành công:", response);
        toast.success("Tạo món thành công");
        setShowForm(false);
      })
      .catch((error) => {
        console.error("Lỗi khi tạo món:", error);
        toast.error("Lỗi khi tạo món ăn");
      });
  };
  console.log("image", imageUrl);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center h-screen">
      <div className="bg-white w-[900px] max-w-[95vw] shadow-lg mb-[80px] mt-[91px] rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary-100 to-primary-400 p-3 flex items-center justify-between">
          <h2 className="text-white text-xl text-center flex-grow">
            Tạo món ăn
          </h2>
        </div>

        <div className="px-4 sm:px-12 max-h-[70vh] sm:max-h-[600px] overflow-auto">
          <div className="mt-5">
            <p>Tên món ăn</p>
            <input
              type="text"
              placeholder="Tên món ăn"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 mb-2 border border-black rounded-lg"
            />

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
              <div className="w-full sm:flex-1">
                <p>Giá</p>
                <input
                  type="number"
                  placeholder="Giá"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-3 border border-black rounded-lg"
                />
              </div>
              <div className="w-full sm:flex-1">
                <p>Loại món ăn</p>
                <select
                  className="w-full p-3 mb-2 border border-black rounded-lg"
                  value={categoryId || ""}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    setCategoryId(selectedId);
                  }}
                >
                  <option value="" disabled>
                    Chọn loại món ăn
                  </option>
                  {(data?.result ?? []).length > 0 ? (
                    data?.result.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))
                  ) : (
                    <option value="">Không có danh mục</option>
                  )}
                </select>
              </div>
              <div className="w-full sm:flex-1">
                <p>Độ phức tạp</p>
                <select
                  className="w-full p-3 mb-2 border border-black rounded-lg"
                  value={difficultyLevel}
                  onChange={(e) => setDifficultyLevel(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p>Mô tả món ăn</p>
            <textarea
              rows={4}
              cols={50}
              placeholder="Mô tả món ăn"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 mb-2 border border-black rounded-lg"
            />

            <div className="flex gap-9">
              <ImageUpload setImageUrl={setImageUrl} imageUrl={imageUrl} />
              <div className="mt-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={readyToServeItems}
                    onChange={(e) => setReadyToServeItems(e.target.checked)}
                    className="w-5 h-5"
                  />
                  <span>Sẵn sàng để ra món</span>
                </label>
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-5 mb-11">
              <button
                onClick={() => setShowForm(false)}
                className="h-[32px] w-[100px] bg-white border border-[#7C3AED] rounded-2xl"
              >
                Đóng
              </button>
              <div className="h-[32px] w-[100px] bg-[#7C3AED] text-white rounded-2xl flex justify-center items-center">
                <Alert
                  open="Tạo"
                  btn1="Hủy"
                  btn2="Tạo mới"
                  description="Tạo món ăn được thêm vào dữ liệu nhà hàng!"
                  title="Bạn có muốn tạo món ăn này không?"
                  handleBtn1={() => {}}
                  handleBtn2={handleCreateDish}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateDishForm;
