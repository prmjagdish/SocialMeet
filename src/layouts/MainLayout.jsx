import React from "react";
import { useSuggestedUsers } from "../context/SuggestedUsersProvider";
import { useNavigate } from "react-router-dom";
import defualtAvatar from "../assets/avatarimage.png";

const MainLayout = ({ children }) => {
  const {
    suggestedUsers = [],
    visibleCount,
    setVisibleCount,
  } = useSuggestedUsers();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      <main className="flex-1 h-screen md:px-8 py-6 overflow-y-auto scrollbar-hide bg-white mx-auto">
        {children}
      </main>

      <aside className="hidden lg:block w-1/3">
        <div className="bg-white h-screen p-5  overflow-y-auto scrollbar-hide">
          <h3 className="text-lg font-semibold text-gray-800 mb-5">
            Suggested for you
          </h3>

          <div className="space-y-2">
            {suggestedUsers.length === 0 && (
              <p className="text-sm text-gray-400">Loading suggestions...</p>
            )}

            {suggestedUsers.slice(0, visibleCount).map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg"
              >
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() =>
                    navigate(`/profile/${u.username.replace("@", "")}`)
                  }
                >
                  <img
                    className="w-10 h-10 rounded-full border border-gray-200"
                    src={u.avatarUrl || defualtAvatar}
                    alt={u.username}
                  />

                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-800">
                      {u.name || u.username.replace("@", "")}
                    </p>
                    <span className="text-xs text-gray-400">{u.username}</span>
                  </div>
                </div>

                <button className="px-4 py-1.5 text-sm font-semibold border rounded-md hover:bg-gray-200">
                  Follow
                </button>
              </div>
            ))}

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
