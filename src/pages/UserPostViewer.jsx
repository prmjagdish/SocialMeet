import { useParams } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { useEffect, useState } from "react";
import PostCard from "@components/post/PostCard";
import { getPublicProfile } from "@api/profile";

const UserPostViewer = () => {
  const { username, postId } = useParams();
  const { me } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);

      try {
        let profile;

        if (me?.user?.username === username) {
          profile = me;
        } else {
          profile = await getPublicProfile(username);
        }

        if (!profile?.posts) {
          setPosts([]);
          return;
        }

        const clickedPost = profile.posts.find((p) => p.id === Number(postId));

        const otherPosts = profile.posts.filter((p) => p.id !== Number(postId));

        setPosts(clickedPost ? [clickedPost, ...otherPosts] : profile.posts);
      } catch (err) {
        console.error("Failed to load user posts", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    if (username && postId) {
      loadPosts();
    }
  }, [username, postId, me]);

  if (loading) {
    return (
      <div className="flex justify-center pt-6">
        <p className="text-gray-500 text-sm">Loading post...</p>
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="flex justify-center pt-6">
        <p className="text-gray-400 text-sm">Post not found</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center lg:justify-start py-6 lg:pl-56">
      <div className="flex flex-col w-80 md:w-[340px] lg:w-[440px] gap-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            isOwner={me?.user?.username === post.username}
            showFollow={me?.user?.username !== post.username}
          />
        ))}
      </div>
    </div>
  );
};

export default UserPostViewer;
