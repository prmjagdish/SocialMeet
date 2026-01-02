import React, { useState } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaRegBookmark,
  FaBookmark,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PostOptions from "./PostEditOptions";
import PostCaptionEdit from "./PostCaptionEdit";
import defualtAvatar from "../../assets/avatarimage.png";
import { followUser, unfollowUser } from "@api/user";

const PostCard = ({ post, isOwner = false, showFollow = true }) => {
  const navigate = useNavigate();

  // normalize username (remove @ if any)
  const username = post.username?.replace(/^@/, "");

  // states
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [caption, setCaption] = useState(post.caption);

  // IMPORTANT: backend sends `followingByMe`
  const [isFollowing, setIsFollowing] = useState(
    post.isFollowing ?? post.followingByMe ?? false
  );

  const handleFollowToggle = async () => {
    const prev = isFollowing;

    // optimistic UI update
    setIsFollowing(!prev);

    try {
      if (prev) {
        await unfollowUser(username);
      } else {
        await followUser(username);
      }
    } catch (error) {
      // rollback on failure
      setIsFollowing(prev);
      console.error("Follow error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleSaveCaption = () => {
    post.caption = caption; // optimistic update
    setEditOpen(false);
  };

  return (
    <div className="bg-white w-full rounded-xl hover:shadow-lg transition mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate(`/profile/${username}`)}
        >
          <img
            src={post.avatarUrl || defualtAvatar}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <p className="font-semibold text-gray-900">{username}</p>
        </div>

        {isOwner ? (
          <PostOptions post={post} onEdit={() => setEditOpen(true)} />
        ) : (
          showFollow && (
            <button
              onClick={handleFollowToggle}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md border transition
                ${
                  isFollowing
                    ? "border-gray-300 text-gray-500 bg-gray-100"
                    : "border-gray-300 text-blue-600 hover:bg-gray-200"
                }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )
        )}
      </div>

      {/* Image */}
      <div className="p-2">
        <img
          src={post.imageUrl}
          alt="post"
          className="w-full aspect-square object-cover mb-2"
        />
        {post.caption && (
          <p className="text-gray-800 text-sm px-2">{post.caption}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-around px-4 py-2 border-b border-gray-200 text-gray-600 text-sm">
        <button
          onClick={() => setLiked(!liked)}
          className={`flex items-center gap-2 transition ${
            liked ? "text-red-500" : "hover:text-red-500"
          }`}
        >
          {liked ? <FaHeart /> : <FaRegHeart />}
          Like
        </button>

        <button
          onClick={() => setSaved(!saved)}
          className={`flex items-center gap-2 transition ${
            saved ? "text-yellow-600" : "hover:text-yellow-600"
          }`}
        >
          {saved ? <FaBookmark /> : <FaRegBookmark />}
          Save
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
