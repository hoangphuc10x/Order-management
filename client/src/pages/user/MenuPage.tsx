import Loading from "@/components/Loading";
import Category from "@/components/user/Category";
import { useGetAllCategoriesQuery } from "@/service/categoryApi";
import { useState } from "react";
import CategoryIcon from "@/components/user/CategoryIcon";
import Reveal from "@/components/Reveal";

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
          className="flex gap-3 lg:gap-5 overflow-x-auto w-full py-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {data?.result.map((category, index) => {
            const active = categories.includes(category._id);
            return (
              <Reveal
                key={category._id}
                delay={index * 0.07}
                y={16}
                className="shrink-0"
              >
                <button
                  title={`Lọc: ${category.name}`}
                  className={`w-full flex flex-col items-center justify-center gap-1 cursor-pointer rounded-2xl border-2 p-3 lg:px-5 transition-all min-w-[84px] lg:min-w-[120px] ${
                    active
                      ? "bg-gradient-to-br from-primary-100 to-primary-400 text-white border-transparent shadow-md"
                      : "bg-white text-gray-700 border-gray-200 hover:border-primary-100 hover:-translate-y-0.5"
                  }`}
                  onClick={() => handleCategoryClick(category._id)}
                >
                  <CategoryIcon name={category.name} />
                  <span className="text-xs lg:text-base text-center font-medium">
                    {category.name}
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>
        {categories.length > 0 && (
          <button
            onClick={() => setCategories([])}
            className="self-start text-sm text-gray-500 hover:text-black underline mt-1"
          >
            Xóa lọc ({categories.length})
          </button>
        )}
      </div>

      <Category categories={categories} inputSearch={inputSearch} />
    </div>
  );
};

export default MenuPage;
