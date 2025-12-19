import React, { useContext, useState } from "react";
import { ProfileContext } from "@context/ProfileContext.jsx";
import FollowerAndFollowing from "./FollowerAndFollowing";
import ProfileEditForm from "./ProfileEditForm";
import { FaShareAlt } from "react-icons/fa";


const ProfileHeader = () => {
  const { profile, setProfile } = useContext(ProfileContext);
  const [showEditModal, setShowEditModal] = useState(false);

  if (!profile) {
    return <div className="text-center p-4 text-gray-500">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6 bg-white rounded-xl  w-full">
      {/* Row 1: Avatar + Username/Name/Bio */}
      <div className="flex gap-6 items-start">
        {/* Avatar */}
        <div className="flex-shrink-0">
         <img
  src={profile.user.avatar || "/image.png"}
  alt={profile.user.name}
  onError={(e) => {
    e.currentTarget.src = "/default-image.png";
  }}
  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border border-gray-300"
/>

        </div>

        {/* Username, Name, Bio */}
        <div className="flex flex-col gap-1">
          <p className="font-bold text-lg sm:text-xl">
            @{profile.user.username}
          </p>
          {profile.user.name && (
            <p className=" text-lg sm:text-xl">{profile.user.name}</p>
          )}
          {profile.user.bio && (
            <p className="text-sm sm:text-base text-gray-700 max-w-xl">
              {profile.user.bio}
            </p>
          )}
        </div>
      </div>

      {/* Row 2: Stats (Start from main div beginning, not avatar) */}
      <div className="flex gap-6 text-sm text-gray-700 ">
        <span>
          <span className="font-semibold">{profile.posts?.length || 0}</span>{" "}
          posts
        </span>
        <FollowerAndFollowing
          followers={profile.followers?.length || 0}
          following={profile.following?.length || 0}
        />
      </div>

      {/* Row 3: Buttons (Start from main div beginning) */}
      {profile.owner && (<div className="flex gap-3">
        <button
          onClick={() => setShowEditModal(true)}
          className="px-4 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm sm:text-base"
        >
          Edit Profile
        </button>
        <button
          onClick={() => alert("Share Profile clicked")}
          className="px-4 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition flex items-center gap-2 text-sm sm:text-base"
        >
          <FaShareAlt /> Share Profile
        </button>
      </div>)}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <ProfileEditForm
          username={profile.user.username}
          setShowEditModal={setShowEditModal}
          setProfile={setProfile}
        />
      )}
    </div>
  );
};

export default ProfileHeader;
