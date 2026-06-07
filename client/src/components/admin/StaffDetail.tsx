import { X } from "lucide-react";
import Loading from "../Loading";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useGetDetailStaffQuery,
  usePutUpdateStaffMutation,
} from "@/service/adminAPI";
import Alert from "../Alert";
import { formatDate } from "../format/FormatDate";
import { useUserInfo } from "@/hook/auth";

interface StaffDetailProps {
  setShowModal: (value: boolean) => void;
  id: string;
}

const StaffDetail = ({ setShowModal, id }: StaffDetailProps) => {
  const [username, setUsername] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { data, isLoading, refetch } = useGetDetailStaffQuery({ id });
  const [updateStaff, { isLoading: isUpdating }] = usePutUpdateStaffMutation();

  const { _id} = useUserInfo();;

  useEffect(() => {
    if (data?.result) {
      setUsername(data.result.username || "");
      setRole(data.result.role || "");
    }
  }, [data]);

  const handleSave = async () => {
    try {
      await updateStaff({ id, username, role });
      toast.success("Cập nhật thành công");
      setIsEditing(false);
      refetch(); // ✅ Cập nhật xong tự fetch lại dữ liệu mới
    } catch (error) {
      console.error("Error updating staff:", error);
      toast.error("Cập nhật thất bại");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
      <div className="bg-white w-[782px] max-w-full h-[434px] shadow-lg  mb-[80px] rounded-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-100 to-primary-400 text-white text-lg font-bold h-[65px] p-4 flex justify-between items-center">
          <span className="mx-auto">Chi tiết nhân viên</span>
          <X
            size={24}
            className="cursor-pointer"
            onClick={() => setShowModal(false)}
          />
        </div>

        {/* Body */}
        <div className="px-10 pt-10 text-lg flex h-[369px] overflow-y-scroll flex-col">
          <div className="flex">
            <div className="px-8 flex items-center justify-center">
              <img
                className="w-[175px] h-[175px] bg-gray-300 rounded-full mb-4 object-cover"
                src="https://placehold.co/600x400"
              ></img>
            </div>

            {/* Info */}
            <div className="pl-[67px] flex-1">
              <div className="mb-6">
                <strong>Tên nhân viên:</strong>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg mt-2"
                  disabled={!isEditing}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <strong>Email:</strong>
                <p className="mt-2">{data?.result?.email}</p>
              </div>

              <div className="mb-6">
                <strong>Ngày đăng ký:</strong>
                <p className="mt-2">
                  {data?.result?.createdAt
                    ? formatDate(data.result.createdAt)
                    : ""}
                </p>
              </div>

              <div className="mb-6">
                <strong>Chức vụ:</strong>
                <select
                  className="w-full p-2 border rounded-lg mt-2"
                  disabled={!isEditing || _id === data?.result?._id}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="">Chọn chức vụ</option>
                  <option value="staff">Nhân viên</option>
                  <option value="chef">Bếp</option>
                  <option value="chef_head">Bếp trưởng</option>
                  <option value="manager">Quản lý</option>
                </select>
              </div>
            </div>
          </div>
          {/* Avatar */}

          <div className="p-4 flex justify-center gap-4 ">
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

        {/* Footer buttons */}
      </div>
    </div>
  );
};

export default StaffDetail;
