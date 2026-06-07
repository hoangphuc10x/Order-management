import Loading from "@/components/Loading";
import Category from "@/components/user/Category";
import { useGetAllCategoriesQuery } from "@/service/categoryApi";
import { useState } from "react";
import CategoryIcon from "@/components/user/CategoryIcon";

const MenuPage = () => {
  const { data, isLoading } = useGetAllCategoriesQuery();
  const [categories, setCategories] = useState<string[]>([]);
  const [inputSearch, setInputSearch] = useState<string>("");

  if (isLoading) {
    return <Loading />;
  }

  const handleCategoryClick = (categoryId: string) => {
    setCategories(
      (prev) =>
        prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId) // Nếu đã có thì xóa
          : [...prev, categoryId] // Nếu chưa có thì thêm vào
    );
  };

  return (
    <div className="flex flex-col lg:gap-4 gap-2 w-full px-4 lg:px-8 my-8">
      {/* <h3 className="font-bold text-[3vw] md:text-[2vw] lg:text-[1.5vw] text-primary-100">Loại đồ ăn</h3> */}
      <div className="flex flex-col gap-2 md:pl-16 lg:pl-0">
        <input
          type="text"
          placeholder="Tìm kiếm món ăn..."
          className="w-full sm:w-[50vw] h-[5vh] lg:h-[6vh] rounded-lg px-4 text-primary-100 bg-white focus:outline-none focus:ring-2 focus:ring-primary-100 border-2 "
          onChange={(e) => setInputSearch(e.target.value)}
        />
        <div
          className="flex gap-4 lg:gap-20 overflow-x-auto w-full "
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {data?.result.map((category) => (
            <div
              key={category._id}
              className={`w-fit flex flex-col items-center cursor-pointer transition-all text-primary-100 ${
                categories.includes(category._id)
                  ? "text-white  rounded-lg bg-primary-100 "
                  : ""
              }`}
              onClick={() => handleCategoryClick(category._id)}
            >
              <CategoryIcon name={category.name} />
              <span className="text-xs w-16 lg:text-lg lg:w-28 text-center">
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Category categories={categories} inputSearch={inputSearch} />
    </div>
  );
};

export default MenuPage;
