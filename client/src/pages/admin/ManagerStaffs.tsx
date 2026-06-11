// Ensure you're importing the correct Staff type
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Search, Trash2, Pencil } from "lucide-react";
import {
  Staff,
  useDeleteStaffMutation,
  useGetAllStaffQuery,
} from "@/service/adminAPI";
import StaffDetail from "@/components/admin/StaffDetail";
import Alert from "@/components/Alert";
import { formatDate } from "@/components/format/FormatDate";

// Thứ tự và nhãn hiển thị của từng chức vụ (labelKey trỏ tới khóa i18n)
const ROLE_GROUPS: { key: string; labelKey: string }[] = [
  { key: "manager", labelKey: "roles.manager" },
  { key: "chef_head", labelKey: "roles.chefHead" },
  { key: "chef", labelKey: "roles.chef" },
  { key: "staff", labelKey: "roles.staff" },
];

const ROLE_LABEL_KEYS: Record<string, string> = ROLE_GROUPS.reduce(
  (acc, g) => ({ ...acc, [g.key]: g.labelKey }),
  {}
);

const ManagerStaffs = () => {
  const { t } = useTranslation();
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const { data, isLoading, isSuccess } = useGetAllStaffQuery();
  const [deleteStaff] = useDeleteStaffMutation();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (data?.result) {
      let filteredStaff = data.result as Staff[];
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredStaff = filteredStaff.filter(
          (staff) =>
            staff.username.toLowerCase().includes(term) ||
            staff.email.toLowerCase().includes(term)
        );
      }
      setStaffs(filteredStaff);
    }
  }, [isSuccess, data, searchTerm]);

  const openModal = (id: string) => {
    setSelectedStaff(id);
    setShowModal(true);
  };

  if (isLoading) {
    return <div className="p-10">{t("common.loading")}</div>;
  }

  // Gom nhóm theo chức vụ, giữ thứ tự đã định nghĩa rồi tới các role lạ
  const knownKeys = ROLE_GROUPS.map((g) => g.key);
  const extraKeys = Array.from(
    new Set(staffs.map((s) => s.role).filter((r) => !knownKeys.includes(r)))
  );
  const groupOrder = [
    ...ROLE_GROUPS,
    ...extraKeys.map((k) => ({ key: k, labelKey: "" })),
  ];

  return (
    <div className="size-full overflow-y-auto">
      {/* Header */}
      <div className="h-16 flex w-full items-center px-10 bg-gradient-to-r from-primary-100 to-primary-400 sticky top-0 z-10">
        <h3 className="text-white font-bold text-xl whitespace-nowrap">
          {t("managerStaffs.title")}
        </h3>
        <div className="flex flex-1 justify-center">
          <div className="flex gap-4 items-center bg-white rounded-xl px-2 py-1 w-[20vw] relative">
            <Search
              size={20}
              color="#6F767E"
              className="z-10 pointer-events-none"
            />
            <input
              placeholder={t("managerStaffs.searchPlaceholder")}
              className="text-sm px-5 py-1 border-none outline-none absolute w-full rounded-xl bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Danh sách nhân viên theo chức vụ */}
      <div className="p-6 space-y-8">
        {staffs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Search size={48} className="mb-3" />
            <p className="text-lg">{t("managerStaffs.notFound")}</p>
          </div>
        ) : (
          groupOrder.map((group) => {
            const members = staffs.filter((s) => s.role === group.key);
            if (members.length === 0) return null;

            return (
              <section key={group.key}>
                <div className="flex items-center gap-3 mb-4">
                  <h4 className="text-lg font-bold text-gray-700">
                    {group.labelKey ? t(group.labelKey) : group.key}
                  </h4>
                  <span className="text-xs font-medium text-primary-100 bg-secondary-100 px-2.5 py-0.5 rounded-full">
                    {members.length}
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {members.map((staff) => (
                    <StaffCard
                      key={staff._id}
                      staff={staff}
                      onEdit={() => openModal(staff._id)}
                      onDelete={() => deleteStaff({ id: staff._id })}
                    />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>

      {/* Modal */}
      {showModal && selectedStaff && (
        <StaffDetail setShowModal={setShowModal} id={selectedStaff} />
      )}
    </div>
  );
};

interface StaffCardProps {
  staff: Staff;
  onEdit: () => void;
  onDelete: () => void | Promise<unknown>;
}

const StaffCard = ({ staff, onEdit, onDelete }: StaffCardProps) => {
  const { t } = useTranslation();
  const initial = (staff.username || "?").charAt(0).toUpperCase();

  return (
    <div className="group flex flex-col items-center bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 transition-all duration-200 hover:-translate-y-1 p-5">
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-primary-400 flex items-center justify-center text-white text-2xl font-bold shadow ring-4 ring-white">
        {initial}
      </div>

      {/* Tên + email */}
      <h5 className="mt-3 font-bold text-gray-800 text-center truncate w-full" title={staff.username}>
        {staff.username}
      </h5>
      <p className="text-sm text-gray-400 text-center truncate w-full" title={staff.email}>
        {staff.email}
      </p>
      <span className="mt-1 text-xs font-medium text-primary-100 bg-secondary-100 px-2.5 py-0.5 rounded-full">
        {ROLE_LABEL_KEYS[staff.role] ? t(ROLE_LABEL_KEYS[staff.role]) : staff.role}
      </span>
      <p className="mt-2 text-xs text-gray-400">
        Tham gia: {formatDate(staff.createdAt)}
      </p>

      {/* Hành động */}
      <div className="flex items-center gap-3 mt-4">
        {/* Chỉnh sửa */}
        <div className="relative group/edit">
          <button
            onClick={onEdit}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary-100 text-gray-600 hover:bg-[#7C3AED] hover:text-white transition-colors"
          >
            <Pencil size={18} />
          </button>
          <Tooltip>{t("managerStaffs.editTooltip")}</Tooltip>
        </div>

        {/* Xóa */}
        <div className="relative group/delete">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary-100 text-gray-600 hover:bg-red-500 hover:text-white transition-colors">
            <Alert
              open=""
              Icon={Trash2}
              btn1={t("common.cancel")}
              btn2={t("common.delete")}
              description={t("managerStaffs.deleteDesc")}
              title={t("managerStaffs.confirmDelete")}
              handleBtn2={async () => {
                await onDelete();
              }}
              handleBtn1={() => {}}
            />
          </div>
          <Tooltip variant="delete">{t("managerStaffs.deleteTooltip")}</Tooltip>
        </div>
      </div>
    </div>
  );
};

// Tooltip nhỏ hiện khi hover vào nút hành động
const Tooltip = ({
  children,
  variant = "edit",
}: {
  children: React.ReactNode;
  variant?: "edit" | "delete";
}) => {
  const showClass =
    variant === "delete"
      ? "group-hover/delete:opacity-100 group-hover/delete:-translate-y-1"
      : "group-hover/edit:opacity-100 group-hover/edit:-translate-y-1";

  return (
    <span
      className={`pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-800 px-2.5 py-1 text-xs text-white opacity-0 transition-all duration-150 ${showClass}`}
    >
      {children}
    </span>
  );
};

export default ManagerStaffs;
