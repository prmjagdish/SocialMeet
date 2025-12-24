import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiMoreHorizontal, FiTrash2, FiLogOut } from "react-icons/fi";
import MenuItem from "./MenuItem";
import useOutsideClick from "@hooks/useOutsideClick";
import { useAuth } from "@context/AuthContext.jsx";
import { deleteAccount } from "@api/profile";
import ConfirmDeleteModal from "@components/ui/CofirmDeleteModal.jsx";

const SidebarMore = ({ variant = "sidebar" }) => {
  const [open, setOpen] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useOutsideClick(ref, () => setOpen(false));

  const isTop = variant === "top";

 const handleDeleteAccount = async () => {
  try {
    setIsDeleting(true);
    await deleteAccount();
    logout();
  } catch {
    alert("Account deletion failed");
  } finally {
    setIsDeleting(false);
  }
};

  return (
    <div ref={ref} className="relative">
      {/* BUTTON */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={
          isTop
            ? "p-2 rounded-full hover:bg-gray-100"
            : "w-full p-4 flex items-center gap-3 hover:bg-gray-100"
        }
      >
        <FiMoreHorizontal className="text-xl" />
        {!isTop && <span className="font-medium text-sm">More</span>}
      </button>

      {/* MENU */}
      {open && (
        <div
          className={
            isTop
              ? "absolute right-0 top-10 w-44 bg-white rounded-xl shadow-lg z-50"
              : "absolute bottom-14 left-4 w-52 bg-[#f8f9f9cc] rounded-xl shadow-lg z-50"
          }
        >
          <MenuItem
            label="Delete account"
            icon={<FiTrash2 />}
            className="text-red-600"
            onClick={() => {
              setOpen(false);
              setShowDeletePopup(true);
            }}
          />
          <MenuItem
            label="Log out"
            icon={<FiLogOut />}
            className="text-red-600"
            onClick={() => {
              logout();
              navigate("/");
            }}
          />
        </div>
      )}
     
      <ConfirmDeleteModal
        open={showDeletePopup}
        title="Delete account?"
        message="This action is irreversible. All your data will be permanently deleted."
        isLoading={isDeleting}
        onCancel={() => setShowDeletePopup(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
};

export default SidebarMore;
