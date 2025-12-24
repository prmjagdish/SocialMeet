import React from "react";
import { Link } from "react-router-dom";

const SavedThumbnail = ({ item }) => {
  const path = `/${item.type}/${item.id}`;

  return (
    <Link to={path}>
      <div className="w-full aspect-square overflow-hidden relative group">
        {item.type === "post" && (
          <img
            src={item.imageUrl}
            alt="Saved Post"
            className="w-full h-full object-cover group-hover:opacity-80 transition duration-200"
          />
        )}
        {item.type === "reel" && (
          <video
            src={item.videoUrl}
            muted
            loop
            className="w-full h-full object-cover group-hover:opacity-80 transition duration-200"
          />
        )}
      </div>
    </Link>
  );
};

export default SavedThumbnail;
