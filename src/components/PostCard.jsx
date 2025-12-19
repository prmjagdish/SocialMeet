import React, { useState } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaRegCommentDots,
  FaRegBookmark,
  FaBookmark,
} from "react-icons/fa";
import { FiSend } from "react-icons/fi"; // for Share button

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="bg-white w-full rounded-xl hover:shadow-lg transition mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={post.avatarUrl || "/image.png"}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-gray-900 text-lx">
              {post.username}
            </p>
            <span className="text-gray-700 text-sm">2 day ago</span>
          </div>
        </div>
        <button className="px-4 py-1.5  text-sm font-semibold rounded-md text-gray-900 border border-gray-300 hover:bg-gray-200 transition-colors">
          Follow
        </button>
      </div>

      {/* Post Image + Caption */}
      <div className="p-2">
        <img
          src={post.imageUrl}
          alt="post"
          className="w-full aspect-square object-cover mb-2"
        />
        <p className="text-gray-800 text-sm px-2">{post.caption}</p>
      </div>

      {/* Action buttons */}
      <div className="flex justify-around px-4 py-2 border-b border-gray-200 text-gray-600 text-sm">
        {/* Like */}
        <button
          onClick={() => setLiked(!liked)}
          className={`flex items-center gap-2 transition ${
            liked ? "text-red-500" : "hover:text-red-500"
          }`}
        >
          {liked ? <FaHeart /> : <FaRegHeart />}
          <span>Like</span>
        </button>

        {/* Comment */}
        <button className="flex items-center gap-2 hover:text-indigo-600 transition">
          <FaRegCommentDots />
          <span>Comment</span>
        </button>

        {/* Share */}
        <button className="flex items-center gap-2 hover:text-green-600 transition">
          <FiSend />
          <span>Share</span>
        </button>

        {/* Save */}
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
    </div>
  );
};

export default PostCard;
