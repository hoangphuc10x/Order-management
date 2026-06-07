// Ensure you're importing the correct Staff type
import { useState, useEffect } from "react";
import { Search, Trash2, Eye } from "lucide-react";
import {
  Staff,
  useDeleteStaffMutation,
  useGetAllStaffQuery,
} from "@/service/adminAPI";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/Table";
import Panigatation from "@/ui/Panigatation";
import StaffDetail from "@/components/admin/StaffDetail";
import Alert from "@/components/Alert";
import { formatDate } from "@/components/format/FormatDate";

const ManagerStaffs = () => {
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [staffs, setStaffs] = useState<Staff[]>([]); // Properly typed state for Staff
  const { data, isLoading, isSuccess } = useGetAllStaffQuery();
  const [deleteStaff] = useDeleteStaffMutation();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const ITEMS_PER_PAGE = 7;

  useEffect(() => {
    if (data?.result) {
      let filteredStaff = data.result as Staff[]; // Explicitly cast data.result to Staff[]

      // Filtering based on search term
      if (searchTerm) {
        filteredStaff = filteredStaff.filter((staff) =>
          staff.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Pagination logic
      const startIndex = currentPage * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      setStaffs(filteredStaff.slice(startIndex, endIndex)); // Set state with properly typed Staff[]
    }
  }, [isSuccess, data, currentPage, searchTerm]);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const openModal = (id: string) => {
    setSelectedStaff(id);
    setShowModal(true);
  };

  console.log(selectedStaff, "selected staff");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="size-full">
      {/* Header */}
      <div className="h-16 flex w-full items-center px-10 bg-gradient-to-r from-primary-100 to-primary-400">
        <h3 className="text-white font-bold text-xl">Quản lý nhân viên</h3>
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
      </div>

      {/* Table */}
      <div className="p-6">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[5%]">STT</TableHead>
              <TableHead className="text-center w-[25%]">
                Tên nhân viên
              </TableHead>
              <TableHead className="text-center w-[25%]">Email</TableHead>
              <TableHead className="text-center w-[15%]">
                Ngày đăng kí
              </TableHead>
              <TableHead className="text-center w-[10%]">Chức vụ</TableHead>
              <TableHead className="text-center w-[20%]">Chức năng</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffs.map((staff, index) => (
              <TableRow key={staff._id}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="text-center">{staff.username}</TableCell>
                <TableCell className="text-center">{staff.email}</TableCell>
                <TableCell className="text-center">
                  {formatDate(staff.createdAt)}
                </TableCell>
                <TableCell className="text-center">{staff.role}</TableCell>
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
                        await deleteStaff({ id: staff._id });
                      }}
                      handleBtn1={() => {}}
                    />
                  </div>
                  <button
                    onClick={() => openModal(staff._id)}
                    className="flex items-center gap-1 bg-[#FBBC05] hover:bg-yellow-300 text-white px-3 py-1 rounded-2xl"
                  >
                    <Eye size={16} /> Xem
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal */}
      {showModal && selectedStaff && (
        <StaffDetail setShowModal={setShowModal} id={selectedStaff} />
      )}

      {/* Pagination */}
      <Panigatation
        pageCount={Math.ceil((data?.result?.length || 0) / ITEMS_PER_PAGE)}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ManagerStaffs;
