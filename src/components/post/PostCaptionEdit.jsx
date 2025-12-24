import React from "react";

const PostCaptionEdit = ({
  caption,
  setCaption,
  handleSaveCaption,
  setEditOpen,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-white bg-opacity-80 w-11/12 max-w-md rounded-lg p-3 shadow-md pointer-events-auto">
        <textarea
          className="w-full border border-gray-300 rounded-md p-2"
          rows={4}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={() => setEditOpen(false)}
            className="px-3 py-1 bg-gray-200 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveCaption}
            className="px-3 py-1 bg-blue-600 text-white rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCaptionEdit;
