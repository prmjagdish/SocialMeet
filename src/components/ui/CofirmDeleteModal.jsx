const ConfirmDeleteModal = ({
  open,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[90%] max-w-sm bg-white rounded-2xl p-6 shadow-xl">

        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          {message}
        </p>
        
        <div className="flex justify-end gap-3">
          <button
            disabled={isLoading}
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-100 disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm rounded-lg text-white flex items-center gap-2
              ${isLoading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
              }`}
          >
            {isLoading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {isLoading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
