import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { uploadPostOrReel } from "../api/posts";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@utils/cropImage";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CreatePost = () => {
  const [activeTab, setActiveTab] = useState("post");
  const [mediaFile, setMediaFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [caption, setCaption] = useState("");

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const { me } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMediaFile(file);
    setPreviewURL(URL.createObjectURL(file));
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const { mutate: createPost, isPending } = useMutation({
    mutationFn: async () => {
      let finalFile = mediaFile;

      if (activeTab === "post" && croppedAreaPixels) {
        finalFile = await getCroppedImg(previewURL, croppedAreaPixels);
      }

      return uploadPostOrReel(me.user.username, finalFile, caption, activeTab);
    },
    onSuccess: () => {
      // Refresh profile and feed
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });

      navigate("/profile");
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Upload failed");
    },
  });

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 pb-24">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          {["post"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setMediaFile(null);
                setPreviewURL(null);
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
                activeTab === tab
                  ? "bg-white shadow text-blue-600"
                  : "text-gray-500"
              }`}
            >
              {tab === "post" ? "Post" : "Reel"}
            </button>
          ))}
        </div>

        {/* Upload */}
        <label className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition mb-4">
          <input
            type="file"
            accept={activeTab === "post" ? "image/*" : "video/*"}
            onChange={handleMediaChange}
            className="hidden"
          />
          {!mediaFile ? (
            <>
              <p className="text-gray-600 font-medium">
                Click to upload {activeTab === "post" ? "image" : "video"}
              </p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG or MP4</p>
            </>
          ) : (
            <span className="text-sm text-blue-600 font-semibold">
              File selected ✓
            </span>
          )}
        </label>

        {/* Cropper */}
        {mediaFile && activeTab === "post" && (
          <>
            <div className="relative w-full h-80 bg-black rounded-xl overflow-hidden">
              <Cropper
                image={previewURL}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
              />
            </div>

            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(e.target.value)}
              className="w-full mt-4"
            />
          </>
        )}

        {/* Caption */}
        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={3}
          className="w-full resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 mb-4"
        />

        {/* Submit */}
        <button
          onClick={() => createPost()}
          disabled={isPending || !mediaFile}
          className={`w-full py-2.5 rounded-xl font-semibold text-white transition ${
            isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isPending ? "Uploading..." : "Share Post"}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
