import React, { useState } from "react";
import { useSuggestedUsers } from "@context/SuggestedUsersProvider";
import { useNavigate } from "react-router-dom";
import defualtAvatar from "../assets/avatarimage.png";
import { followUser, unfollowUser } from "@api/user";

const SearchPage = () => {
  const { suggestedUsers = [] } = useSuggestedUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);
  const [users, setUsers] = useState(suggestedUsers); // local state for toggling
  const navigate = useNavigate();

  // Remove @ from username
  const cleanUsername = (username) => username.replace(/^@/, "");

  // Filter users based on search term
  const filteredUsers = users.filter(
    (u) =>
      (u.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cleanUsername(u.username) || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle follow/unfollow
  const handleFollowToggle = async (user) => {
    try {
      const username = cleanUsername(user.username);
      if (user.following) {
        await unfollowUser(username);
      } else {
        await followUser(username);
      }
      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, following: !u.following } : u
        )
      );
    } catch (err) {
      console.error("Error toggling follow:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen p-4 pb-24 md:pb-4 flex justify-center">
      <div className="w-full max-w-md">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name or username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 mb-6 rounded-lg border border-gray-300
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Users List */}
        {filteredUsers.length > 0 ? (
          <>
            <div className="space-y-3">
              {filteredUsers.slice(0, visibleCount).map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between bg-white
                             border border-gray-200 rounded-lg p-3 shadow-sm
                             hover:shadow-md transition"
                >
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => navigate(`/profile/${cleanUsername(u.username)}`)}
                  >
                    <img
                      src={u.avatarUrl || defualtAvatar}
                      alt={u.username}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => (e.currentTarget.src = defualtAvatar)}
                    />
                    <div>
                      <p className="font-semibold text-sm">
                        {u.name || cleanUsername(u.username)}
                      </p>
                      <p className="text-gray-500 text-sm">{cleanUsername(u.username)}</p>
                    </div>
                  </div>

                  {/* Follow / Unfollow Button */}
                  <button
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md border 
                                ${u.following ? "border-gray-300 text-gray-500 bg-gray-100" 
                                                : "border-gray-300 text-blue-500 hover:bg-gray-200"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollowToggle(u);
                    }}
                  >
                    {u.following ? "Following" : "Follow"}
                  </button>
                </div>
              ))}
            </div>

            {/* Show More Button */}
            {visibleCount < filteredUsers.length && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setVisibleCount((v) => v + 5)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Show more
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500 text-center">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
