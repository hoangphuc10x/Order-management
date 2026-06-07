import { ChevronLeft, ChevronRight } from "lucide-react";
import ReactPaginate from "react-paginate";

interface PaginationProps {
  pageCount: number;
  onPageChange: (selectedItem: { selected: number }) => void;
}

const Panigatation: React.FC<PaginationProps> = ({ pageCount, onPageChange }) => {
  return (
    <div className="pr-[20vh]">
      <ReactPaginate
        previousLabel={<ChevronLeft size={20} />}
        nextLabel={<ChevronRight size={20} />}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={1}
        pageRangeDisplayed={2}
        onPageChange={onPageChange}
        containerClassName="flex items-center justify-end space-x-1"
        pageClassName="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 text-white text-xs font-bold"
        activeClassName="bg-yellow-400 text-white"
        previousClassName="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-400 text-white"
        nextClassName="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-400 text-white"
        disabledClassName="opacity-50 cursor-not-allowed"
      />
    </div>
  );
};

export default Panigatation;
