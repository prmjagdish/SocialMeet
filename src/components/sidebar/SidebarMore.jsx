import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiMoreHorizontal, FiSettings, FiLogOut } from "react-icons/fi";
import MenuItem from "./MenuItem";
import useOutsideClick from "@hooks/useOutsideClick";
import { useAuth } from "@context/AuthContext.jsx";

const SidebarMore = ({ variant = "sidebar" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useOutsideClick(ref, () => setOpen(false));

  const isTop = variant === "top";

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
          <MenuItem label="Settings" icon={<FiSettings />} />
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
    </div>
  );
};

export default SidebarMore;
