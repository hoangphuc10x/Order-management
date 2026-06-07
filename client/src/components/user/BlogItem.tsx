import { CalendarDays } from "lucide-react";
import blog from "../../assets/Blog.png";

const BlogItem = () => {
  return (
    <div className="group w-full flex flex-col bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-200 overflow-hidden transition-all duration-200">
      <div className="w-full h-44 overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          src={blog}
          alt=""
        />
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-bold text-gray-800 line-clamp-1">
          Ẩm thực đà nẵng lọt tóp thế giới
        </h3>
        <div className="w-full flex justify-between items-center text-xs text-gray-400 my-2">
          <span className="flex gap-1 items-center">
            <CalendarDays size={14} />
            October 28, 2023
          </span>
          <span>Đầu bếp Minh</span>
        </div>
        <p className="text-sm text-gray-500 line-clamp-3">
          Đến với Đà Nẵng, du khách không thể bỏ qua cơ hội thưởng thức những món
          ăn đặc sản trứ danh, mang đậm hương vị của miền Trung. Ẩm thực Đà Nẵng
          là sự kết hợp hài hòa giữa hương vị dân dã
        </p>
        <button className="mt-4 self-start px-5 py-2 rounded-full bg-gradient-to-r from-primary-100 to-primary-400 text-white text-sm hover:opacity-90 shadow-md transition-opacity">
          Đọc thêm
        </button>
      </div>
    </div>
  );
};

export default BlogItem;
