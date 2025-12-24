import React from "react";
import { Link } from "react-router-dom";

const PostThumbnail = ({ post }) => {
  return (
    <Link to={`/post/${post.id}`} className="relative group block">
      <div className="w-full aspect-square overflow-hidden">
        <img
          src={post?.imageUrl}
          alt={post.caption || "Post"}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    </Link>
  );
};

export default PostThumbnail;
