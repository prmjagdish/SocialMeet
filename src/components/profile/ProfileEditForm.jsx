import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../api/config";

const ProfileEditForm = ({ username, setShowEditModal, setProfile }) => {
  const [editForm, setEditForm] = useState({ name: "", bio: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSave = async () => {
    try {
      let imageUrl = null;
      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        const uploadRes = await axios.post(
          `${API_BASE_URL}/api/images/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        imageUrl = uploadRes.data.url;
      }

      const payload = { ...editForm };
      if (imageUrl) payload.avatar = imageUrl;

      await axios.put(`${API_BASE_URL}/api/profile/${username}/edit`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setProfile((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          ...editForm,
          ...(imageUrl && { avatar: imageUrl }),
        },
      }));

      setShowEditModal(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">
          Edit Profile
        </h2>

        <input
          type="text"
          placeholder="Name"
          value={editForm.name}
          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          className="w-full mb-3 px-4 py-2 border border-gray-300 rounded"
        />

        <input
          type="text"
          placeholder="Bio"
          value={editForm.bio}
          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
          className="w-full mb-3 px-4 py-2 border border-gray-300 rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full mb-3 px-4 py-2 border border-gray-300 rounded"
        />

        {preview && (
          <div className="flex justify-center mb-3">
            <img
              src={preview}
              alt="preview"
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
        )}

        <div className="flex justify-end gap-3 mt-4 flex-wrap">
          <button
            onClick={() => setShowEditModal(false)}
            className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 border rounded  text-gray-700 rounded  hover:bg-gray-100"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditForm;
