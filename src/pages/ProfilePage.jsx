import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProfileHeader from "@components/ProfileHeader";
import PostThumbnail from "@components/PostThumbnail";
import SavedThumbnail from "@components/SavedThumbnail";
import ReelThumbnail from "@components/ReelThumbnail";
import SidebarMore from "@components/sidebar/SidebarMore";
import dummyReels from "@data/Reel";
import savedPosts from "@data/Saved";

import { ProfileContext } from "@context/ProfileContext";
import { getMyProfile, getPublicProfile } from "@api/profile";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const { profile, setProfile } = useContext(ProfileContext); 
  const { username } = useParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfile(null);

        if (username) {
          const data = await getPublicProfile(username);
          setProfile(data);
        } else {
          const data = await getMyProfile();
          setProfile(data);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [username, setProfile]);

  if (!profile) {
    return <p className="text-center py-10">Loading profile...</p>;
  }

  const tabs = [
    { label: "Posts", key: "posts" },
    // { label: "Reels", key: "reels" },
    { label: "Saved", key: "saved" },
  ];

  const renderTabContent = () => {
    if (activeTab === "posts") {
      if (!profile.posts?.length) {
        return <p className="text-center text-gray-400 py-10">No posts yet</p>;
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

    // if (activeTab === "reels") {
    //   return dummyReels.map((reel) => (
    //     <ReelThumbnail key={reel.id} reel={reel} />
    //   ));
    // }

    if (activeTab === "saved") {
      return savedPosts.map((item) => (
        <SavedThumbnail key={`${item.type}-${item.id}`} item={item} />
      ));
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 py-4 text-gray-900">
      <div className="max-w-5xl mx-auto flex justify-end px-2 sm:hidden">
        <SidebarMore variant="top" />
      </div>

      <div className="max-w-5xl mx-auto">
        <ProfileHeader />

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-300 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`pb-2 font-semibold transition ${
                activeTab === tab.key
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab.key)}
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
