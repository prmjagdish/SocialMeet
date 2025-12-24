import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { uploadPostOrReel } from "../../api/post";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@utils/cropImage";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CreatePost = () => {
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

      if (croppedAreaPixels) {
        finalFile = await getCroppedImg(previewURL, croppedAreaPixels);
      }

      return uploadPostOrReel(me.user.username, finalFile, caption, "post");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
      navigate("/profile");
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Upload failed");
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="h-20 flex items-center justify-center bg-white">
        <h1 className="text-base font-semibold text-gray-900">Create Post</h1>
      </div>

      <div className="flex-1 flex justify-center bg-white items-start px-4 py-6">
        <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          {!mediaFile && (
            <label className="h-64 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleMediaChange}
                className="hidden"
              />
              <p className="text-gray-700 font-medium">Upload an image</p>
              <p className="text-xs text-gray-400 mt-1">
                JPG or PNG • Square recommended
              </p>
            </label>
          )}

          {mediaFile && (
            <>
              <div className="relative w-full h-80 bg-black rounded-xl overflow-hidden mb-4">
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
                className="w-full mb-4"
              />

              <textarea
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 mb-4"
              />

              <button
                onClick={() => createPost()}
                disabled={isPending}
                className={`w-full py-3 rounded-xl font-semibold text-white transition
                  ${
                    isPending
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }
                `}
              >
                {isPending ? "Uploading..." : "Upload"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
