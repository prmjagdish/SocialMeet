import React, { useState } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaRegCommentDots,
  FaRegBookmark,
  FaBookmark,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PostOptions from "./PostEditOptions";
import PostCaptionEdit from "./PostCaptionEdit";
import defualtAvatar from "../../assets/avatarimage.png";

const PostCard = ({ post, isOwner = false, showFollow = true }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [caption, setCaption] = useState(post.caption);
  const navigate = useNavigate();

  const handleSaveCaption = () => {
    // Here you can call your API to save the caption
    post.caption = caption; // Optimistic update
    setEditOpen(false); // Close modal
  };

  return (
    <div className="bg-white w-full rounded-xl hover:shadow-lg transition mx-auto">
      <div className="flex items-center justify-between px-4 py-3">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate(`/profile/${post.username.replace("@", "")}`)}
        >
          <img
            src={post.avatarUrl || defualtAvatar}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <p className="font-semibold text-gray-900">{post.username}</p>
        </div>

        {isOwner ? (
          <PostOptions post={post} onEdit={() => setEditOpen(true)} />
        ) : (
          showFollow && (
            <button className="px-4 py-1.5 text-sm font-semibold rounded-md text-gray-900 border border-gray-300 hover:bg-gray-200">
              Follow
            </button>
          )
        )}
      </div>

      <div className="p-2">
        <img
          src={post.imageUrl}
          alt="post"
          className="w-full aspect-square object-cover mb-2"
        />
        <p className="text-gray-800 text-sm px-2">{post.caption}</p>
      </div>

      <div className="flex justify-around px-4 py-2 border-b border-gray-200 text-gray-600 text-sm">
        <button
          onClick={() => setLiked(!liked)}
          className={`flex items-center gap-2 transition ${
            liked ? "text-red-500" : "hover:text-red-500"
          }`}
        >
          {liked ? <FaHeart /> : <FaRegHeart />}
          <span>Like</span>
        </button>

        <button
          onClick={() => setSaved(!saved)}
          className={`flex items-center gap-2 transition ${
            saved ? "text-yellow-600" : "hover:text-yellow-600"
          }`}
        >
          {saved ? <FaBookmark /> : <FaRegBookmark />}
          <span>Save</span>
        </button>
      </div>

      {editOpen && (
        <PostCaptionEdit
          caption={caption}
          setCaption={setCaption}
          handleSaveCaption={handleSaveCaption}
          setEditOpen={setEditOpen}
        />
      )}
    </div>
  );
};

export default PostCard;
