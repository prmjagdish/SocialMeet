import React, { useState } from "react";
import { useSuggestedUsers } from "../context/SuggestedUsersProvider";
import { useNavigate } from "react-router-dom";
import defualtAvatar from "../assets/avatarimage.png";
import { followUser, unfollowUser } from "@api/user";

const MainLayout = ({ children }) => {
  const {
    suggestedUsers = [],
    visibleCount,
    setVisibleCount,
    setSuggestedUsers,
  } = useSuggestedUsers();

  const navigate = useNavigate();

  const handleFollowToggle = async (user) => {
    const username = user.username.replace(/^@/, "");
    const prev = user.followingByMe;

    // optimistic update
    setSuggestedUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.id === user.id ? { ...u, followingByMe: !prev } : u
      )
    );

    try {
      if (prev) {
        await unfollowUser(username);
      } else {
        await followUser(username);
      }
    } catch (error) {
      // rollback on failure
      setSuggestedUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user.id ? { ...u, followingByMe: prev } : u
        )
      );
      console.error("Follow error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      {/* Main content */}
      <main className="flex-1 h-screen md:px-8 py-6 overflow-y-auto scrollbar-hide bg-white mx-auto">
        {children}
      </main>

      {/* Suggested users */}
      <aside className="hidden lg:block w-1/3">
        <div className="bg-white h-screen p-5 overflow-y-auto scrollbar-hide">
          <h3 className="text-lg font-semibold text-gray-800 mb-5">
            Suggested for you
          </h3>

          <div className="space-y-2">
            {suggestedUsers.length === 0 && (
              <p className="text-sm text-gray-400">Loading suggestions...</p>
            )}

            {suggestedUsers.slice(0, visibleCount).map((u) => {
              const username = u.username.replace(/^@/, "");

              return (
                <div
                  key={u.id}
                  className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg"
                >
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => navigate(`/profile/${username}`)}
                  >
                    <img
                      className="w-10 h-10 rounded-full border border-gray-200"
                      src={u.avatarUrl || defualtAvatar}
                      alt={u.username}
                    />

                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-gray-800">
                        {u.name || username}
                      </p>
                      <span className="text-xs text-gray-400">
                        @{username}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleFollowToggle(u)}
                    className={`px-4 py-1.5 text-sm font-semibold border rounded-md transition
                      ${
                        u.followingByMe
                          ? "bg-gray-100 text-gray-500 border-gray-300"
                          : "text-blue-600 border-gray-300 hover:bg-gray-200"
                      }`}
                  >
                    {u.followingByMe ? "Following" : "Follow"}
                  </button>
                </div>
              );
            })}

            {visibleCount < suggestedUsers.length && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setVisibleCount((v) => v + 5)}
                  className="text-sm font-medium text-blue-600"
                >
                  Show more
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default MainLayout;
