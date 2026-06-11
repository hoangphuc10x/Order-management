import { X } from "lucide-react";
import Loading from "../Loading";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { data, isLoading, refetch } = useGetDetailStaffQuery({ id });
  const [updateStaff, { isLoading: isUpdating }] = usePutUpdateStaffMutation();

  const { _id} = useUserInfo();;

  useEffect(() => {
    if (data?.result) {
      setUsername(data.result.username || "");
      setEmail(data.result.email || "");
      setRole(data.result.role || "");
    }
  }, [data]);

  const handleSave = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t("staffDetail.invalidEmail"));
      return;
    }
    try {
      await updateStaff({ id, username, role, email });
      toast.success(t("staffDetail.updateSuccess"));
      setIsEditing(false);
      refetch(); // ✅ Cập nhật xong tự fetch lại dữ liệu mới
    } catch (error) {
      console.error("Error updating staff:", error);
      toast.error(t("staffDetail.updateFail"));
    }
  };

  if (isLoading) return <Loading />;

  const ROLE_LABELS: Record<string, string> = {
    staff: t("roles.staff"),
    chef: t("roles.chef"),
    chef_head: t("roles.chefHead"),
    manager: t("roles.manager"),
  };

  const isSelf = _id === data?.result?._id;
  const initial = (data?.result?.username || "?").charAt(0).toUpperCase();

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center p-4"
      onClick={() => setShowModal(false)}
    >
      <div
        className="bg-white w-[640px] max-w-full shadow-2xl rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary-100 to-primary-400 text-white px-6 pt-6 pb-16">
          <span className="block text-center text-lg font-bold">
            {t("staffDetail.title")}
          </span>
          <X
            size={22}
            className="absolute top-5 right-5 cursor-pointer hover:opacity-80 transition"
            onClick={() => setShowModal(false)}
          />
        </div>

        {/* Avatar overlapping header */}
        <div className="relative z-10 flex flex-col items-center -mt-12 px-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-primary-400 ring-4 ring-white shadow-md flex items-center justify-center text-white text-3xl font-bold">
            {initial}
          </div>
          <h3 className="mt-3 text-xl font-bold text-gray-800">{username}</h3>
          <span className="mt-1 inline-block text-xs font-medium text-primary-100 bg-secondary-100 px-3 py-1 rounded-full">
            {ROLE_LABELS[role] || role || t("staffDetail.undefined")}
          </span>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-1">
              {t("staffDetail.nameLabel")}
            </label>
            <input
              type="text"
              className={`w-full p-2.5 border rounded-lg outline-none transition ${
                isEditing
                  ? "border-yellow-400 focus:ring-2 focus:ring-yellow-300 bg-white"
                  : "border-gray-200 bg-gray-50 text-gray-600"
              }`}
              disabled={!isEditing}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-500 mb-1">
                {t("staffDetail.emailLabel")}
              </label>
              <input
                type="email"
                className={`w-full p-2.5 border rounded-lg outline-none transition ${
                  isEditing
                    ? "border-yellow-400 focus:ring-2 focus:ring-yellow-300 bg-white"
                    : "border-gray-200 bg-gray-50 text-gray-600"
                }`}
                disabled={!isEditing}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-500 mb-1">
                {t("staffDetail.joinDate")}
              </label>
              <p className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                {data?.result?.createdAt
                  ? formatDate(data.result.createdAt)
                  : "—"}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-1">
              {t("staffDetail.roleLabel")}
            </label>
            <select
              className={`w-full p-2.5 border rounded-lg outline-none transition ${
                isEditing && !isSelf
                  ? "border-yellow-400 focus:ring-2 focus:ring-yellow-300 bg-white"
                  : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
              }`}
              disabled={!isEditing || isSelf}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">{t("staffDetail.selectRole")}</option>
              <option value="staff">{t("roles.staff")}</option>
              <option value="chef">{t("roles.chef")}</option>
              <option value="chef_head">{t("roles.chefHead")}</option>
              <option value="manager">{t("roles.manager")}</option>
            </select>
            {isSelf && (
              <p className="text-xs text-gray-400 mt-1">
                {t("staffDetail.cannotChangeOwnRole")}
              </p>
            )}
          </div>
        </div>

        {/* Footer buttons */}
        <div className="px-8 pb-6 flex justify-end gap-3">
          <button
            className="h-10 px-6 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-100 transition"
            onClick={() => setShowModal(false)}
          >
            {t("common.close")}
          </button>
          {isEditing ? (
            <div className="h-10 px-6 text-white bg-yellow-500 rounded-xl hover:bg-yellow-600 flex justify-center items-center transition">
              <Alert
                open={isUpdating ? t("common.saving") : t("common.saveBtn")}
                btn1={t("common.cancel")}
                btn2={t("common.save")}
                description={t("staffDetail.saveDesc")}
                title={t("staffDetail.confirmSaveTitle")}
                handleBtn2={handleSave}
                handleBtn1={() => {}}
              />
            </div>
          ) : (
            <button
              className="h-10 px-6 text-white bg-yellow-500 rounded-xl hover:bg-yellow-600 transition"
              onClick={() => setIsEditing(true)}
            >
              {t("common.edit")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDetail;
