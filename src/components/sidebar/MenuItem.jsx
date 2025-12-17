const MenuItem = ({ label, icon, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 text-sm flex items-center gap-3 hover:bg-gray-100 ${className}`}
    >
      {icon}
      {label}
    </button>
  );
};

export default MenuItem;
