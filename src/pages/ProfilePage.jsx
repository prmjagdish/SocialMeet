import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ProfileHeader from "@components/ProfileHeader";
import PostThumbnail from "@components/PostThumbnail";
import SavedThumbnail from "@components/SavedThumbnail";
import SidebarMore from "@components/sidebar/SidebarMore";
import savedPosts from "@data/Saved";
import { useAuth } from "@context/AuthContext";
import { getMyProfile, getPublicProfile } from "@api/profile";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const { username } = useParams();
  const navigate = useNavigate();
  const { me } = useAuth();

  const isOwnProfile =
    !username || username === me?.user?.username;

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile", isOwnProfile ? "me" : username],
    queryFn: () =>
      isOwnProfile
        ? getMyProfile()
        : getPublicProfile(username),
    enabled: isOwnProfile || !!username,
    keepPreviousData: true,
  });

  if (isLoading) {
    return <p className="text-center py-10">Loading profile...</p>;
  }

  if (isError || !profile) {
    return (
      <p className="text-center py-10 text-red-500">
        Failed to load profile
      </p>
    );
  }

  const tabs = [
    { label: "Posts", key: "posts" },
    ...(isOwnProfile ? [{ label: "Saved", key: "saved" }] : []),
  ];

  const renderTabContent = () => {
    if (activeTab === "posts") {
      if (!profile.posts?.length) {
        return (
          <p className="text-center text-gray-400 py-10 col-span-full">
            No posts yet
          </p>
        );
      }

      return profile.posts.map((post) => (
        <div
          key={post.id}
          onClick={() => navigate(`/home?scrollTo=${post.id}`)}
          className="cursor-pointer"
        >
          <PostThumbnail post={post} />
        </div>
      ));
    }

    if (activeTab === "saved") {
      return savedPosts.map((item) => (
        <SavedThumbnail
          key={`${item.type}-${item.id}`}
          item={item}
        />
      ));
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 py-4 text-gray-900">
      <div className="max-w-5xl mx-auto flex justify-end px-2 sm:hidden">
        <SidebarMore variant="top" />
      </div>

      <div className="max-w-5xl mx-auto">
        <ProfileHeader profile={profile} />

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-300 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-2 font-semibold transition ${
                activeTab === tab.key
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
