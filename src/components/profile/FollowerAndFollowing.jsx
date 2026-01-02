import React, { useState } from "react";
import defaultAvatar from "../../assets/avatarimage.png";
import { useNavigate } from "react-router-dom";
import { followUser, unfollowUser } from "@api/user"; // your API functions

const FollowerAndFollowing = ({ followers = [], following = [] }) => {
  const [showModal, setShowModal] = useState(null);
  const [localFollowers, setLocalFollowers] = useState(followers);
  const [localFollowing, setLocalFollowing] = useState(following);

  const navigate = useNavigate();

  const list = showModal === "followers" ? localFollowers : localFollowing;

  const handleFollowToggle = async (user) => {
    try {
      if (user.following) {
        // Unfollow
        await unfollowUser(user.username);
        // Update local state
        setLocalFollowers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, following: false } : u
          )
        );
        setLocalFollowing((prev) =>
          prev.filter((u) => u.id !== user.id)
        );
      } else {
        // Follow
        await followUser(user.username);
        setLocalFollowers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, following: true } : u
          )
        );
        setLocalFollowing((prev) => [...prev, user]);
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex gap-6 text-sm text-gray-700">
      {/* Followers */}
      <button
        onClick={() => setShowModal("followers")}
        className="hover:text-gray-900 transition"
      >
        <div className="flex gap-2">
          <span className="font-semibold">{localFollowers.length}</span>
          <span>Followers</span>
        </div>
      </button>

      {/* Following */}
      <button
        onClick={() => setShowModal("following")}
        className="hover:text-gray-900 transition"
      >
        <div className="flex gap-2">
          <span className="font-semibold">{localFollowing.length}</span>
          <span>Following</span>
        </div>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center sm:justify-center">
          <div
            className="
              bg-white w-full 
              sm:max-w-md sm:rounded-xl
              rounded-t-2xl
              p-4
              shadow-lg
              max-h-[80vh]
              flex flex-col
            "
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold capitalize">{showModal}</h3>
              <button
                onClick={() => setShowModal(null)}
                className="text-gray-500 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            {list.length === 0 ? (
              <p className="text-center text-gray-500 py-6">
                No {showModal} yet
              </p>
            ) : (
              <ul className="space-y-3 overflow-y-auto">
                {list.map((u) => (
                  <li key={u.id} className="flex items-center justify-between">
                    <div
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => {
                        setShowModal(null);
                        navigate(`/profile/${u.username}`);
                      }}
                    >
                      <img
                        src={u.avatar || defaultAvatar}
                        alt={u.username}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => (e.currentTarget.src = defaultAvatar)}
                      />
                      <div className="flex flex-col">
                        <p className="font-semibold text-gray-800 hover:underline">
                          {u.name || u.username}
                        </p>
                        <span className="text-sm text-gray-500">
                          @{u.username}
                        </span>
                      </div>
                    </div>

                    {/* Follow / Unfollow button */}
                    <button
                      className={`font-medium ${
                        u.following ? "text-gray-400" : "text-blue-500"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFollowToggle(u);
                      }}
                    >
                      {u.following
                        ? showModal === "followers"
                          ? "Following"
                          : "Unfollow"
                        : "Follow"}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowerAndFollowing;
