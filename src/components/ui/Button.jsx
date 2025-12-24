const Button = ({
  children,
  type = "button",
  onClick,
  disabled = false,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full py-1.5 rounded-md font-semibold text-white transition
        ${
          disabled
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
