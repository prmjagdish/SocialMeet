import React, { useContext, useState, useEffect } from "react";
import FollowerAndFollowing from "./FollowerAndFollowing";
import ProfileEditForm from "./ProfileEditForm";
import { FaShareAlt } from "react-icons/fa";
import defualtAvatar from "../../assets/avatarimage.png";
import { useParams } from "react-router-dom";
import { followUser, unfollowUser } from "@api/user";

const ProfileHeader = ({ profile }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { username } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (profile?.followingByMe !== undefined) {
      setIsFollowing(profile.followingByMe);
    }
  }, [profile]);

  const handleFollowToggle = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (isFollowing) {
        await unfollowUser(username);
        setIsFollowing(false);
      } else {
        await followUser(username);
        setIsFollowing(true);
      }
    } catch (err) {
      console.error("Follow action failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return <div className="text-center p-4 text-gray-500">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6 bg`-white rounded-xl  w-full">
      <div className="flex gap-6 items-start">
        <div className="flex-shrink-0">
          <img
            src={profile.user.avatar || defualtAvatar}
            alt={profile.user.name}
            onError={(e) => {
              e.currentTarget.src = defualtAvatar;
            }}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border border-gray-300"
          />
        </div>

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

      <div className="flex gap-6 text-sm text-gray-700 ">
        <span>
          <span className="font-semibold">{profile.posts?.length || 0}</span>{" "}
          posts
        </span>
        <FollowerAndFollowing
          followers={profile.followers || []}
          following={profile.following || []}
        />
      </div>

      <div className="flex gap-3">
        {profile.owner ? (
          <>
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
          </>
        ) : (
          <>
            <button
              onClick={handleFollowToggle}
              disabled={loading}
              className={`px-4 py-1 rounded-lg border transition
        ${
          isFollowing
            ? " border-gray-300 hover:bg-gray-100 text-gray-800"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }
      `}
            >
              {loading ? "Please wait..." : isFollowing ? "Unfollow" : "Follow"}
            </button>
            <button
              onClick={() => alert("Share Profile clicked")}
              className="px-4 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition flex items-center gap-2 text-sm sm:text-base"
            >
              <FaShareAlt /> Share Profile
            </button>
          </>
        )}
      </div>

      {showEditModal && (
        <ProfileEditForm
          username={profile.user.username}
          setShowEditModal={setShowEditModal}
          setProfile={profile}
        />
      )}
    </div>
  );
};

export default ProfileHeader;
