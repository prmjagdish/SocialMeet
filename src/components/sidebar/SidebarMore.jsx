import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiMoreHorizontal, FiTrash2, FiLogOut } from "react-icons/fi";
import MenuItem from "./MenuItem";
import useOutsideClick from "@hooks/useOutsideClick";
import { useAuth } from "@context/AuthContext.jsx";
import { deleteAccount } from "@api/profile";

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
    if (isDeleting) return; // prevent double click

    setIsDeleting(true);
    try {
      await deleteAccount();
      logout();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Delete account failed", err);
    } finally {
      setIsDeleting(false);
      setShowDeletePopup(false);
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
      {showDeletePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[90%] max-w-sm bg-white rounded-2xl p-6 shadow-xl">
            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Delete account?
            </h2>

            {/* Message */}
            <p className="text-sm text-gray-500 mb-6">
              This action is permanent. Your profile, posts, and data will be
              deleted and cannot be recovered.
            </p>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                disabled={isDeleting}
                onClick={() => setShowDeletePopup(false)}
                className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className={`px-4 py-2 text-sm rounded-lg text-white flex items-center gap-2
                  ${isDeleting
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                  }`}
              >
                {isDeleting && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarMore;
