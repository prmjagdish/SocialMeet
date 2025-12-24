import React, { useState, useEffect, useRef, useCallback } from "react";
import MainLayout from "@layouts/MainLayout";
import PostCard from "@components/post/PostCard";
import { fetchFeedPosts } from "@api/post";
import { useLocation } from "react-router-dom";
import { useAuth } from "@context/AuthContext";

const HomePage = () => {
  const { me } = useAuth();
  const username = me?.user?.username;

  const [postList, setPostList] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loader = useRef(null);
  const fetchedPages = useRef(new Set());

  const location = useLocation();
  const [scrollTarget, setScrollTarget] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollToId = params.get("scrollTo");
    if (scrollToId) setScrollTarget(scrollToId);
  }, [location]);

  useEffect(() => {
    if (!scrollTarget) return;

    const interval = setInterval(() => {
      const el = document.getElementById(`post-${scrollTarget}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        clearInterval(interval);
        setScrollTarget(null);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [scrollTarget]);

  const fetchFeed = useCallback(async () => {
    if (loading || !hasMore || fetchedPages.current.has(page)) return;

    setLoading(true);
    try {
      const data = await fetchFeedPosts(page, 10);

      if (Array.isArray(data) && data.length) {
        setPostList((prev) => {
          const filtered = username
            ? data.filter((post) => post.username !== username)
            : data;
          const unique = filtered.filter(
            (post) => !prev.some((p) => p.id === post.id)
          );
          return [...prev, ...unique];
        });

        fetchedPages.current.add(page);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching feed:", err);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, username]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  useEffect(() => {
    if (!loader.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(loader.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  useEffect(() => {
    setPostList([]);
    setPage(0);
    setHasMore(true);
    fetchedPages.current.clear();
  }, [username]);

  return (
    <MainLayout>
      <div className="flex justify-center">
        <div className="flex flex-col w-80 md:w-[340px] lg:w-[440px] gap-4">
          {postList.map((post) => (
            <div key={post.id} id={`post-${post.id}`}>
              <PostCard
                post={post}
                isOwner={username === post.username}
                showFollow={username !== post.username}
              />
            </div>
          ))}
        </div>
      </div>

      {hasMore && (
        <div ref={loader} className="text-center p-4 text-gray-500">
          {loading ? "Loading..." : "Scroll to load more"}
        </div>
      )}
    </MainLayout>
  );
};

export default HomePage;
