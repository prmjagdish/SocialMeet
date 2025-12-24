import React, { useState } from "react";

const FollowerAndFollowing = ({ followers, following }) => {
  const [showModal, setShowModal] = useState(null);

  const dummyList = Array(6).fill(user); // Dummy users for modal

  return (
    <div className="flex gap-6 text-sm text-gray-700">
      <button onClick={() => setShowModal("followers")} className="hover:text-gray-900 transition">
        <div className="flex gap-2">
          <span className="font-semibold">{followers}</span>
          <span> Followers</span>
        </div>
      </button>
      <button onClick={() => setShowModal("following")} className="hover:text-gray-900 transition">
        <div className="flex gap-2">
          <span className="font-semibold">{following}</span>
          <span>Following</span>
        </div>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white w-full max-w-md p-4 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 capitalize">{showModal}</h3>
            <ul className="space-y-3 max-h-60 overflow-y-auto">
              {dummyList.map((u, i) => (
                <li key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex flex-col text-gray-800">
                      <p className="font-semibold">{u.name}</p>
                      <span className="text-sm text-gray-500">@{user.username}</span>
                    </div>
                  </div>
                  <button className="text-blue-500 font-medium">Follow</button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowModal(null)}
              className="mt-4 w-full py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowerAndFollowing;
