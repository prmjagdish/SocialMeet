import { useState, useRef } from "react";
import { FiMoreHorizontal, FiTrash2, FiEdit2, FiShare } from "react-icons/fi";
import useOutsideClick from "@hooks/useOutsideClick";
import { deletePost } from "@api/post";
import ConfirmDeleteModal from "@components/ui/CofirmDeleteModal.jsx";
import { useAuth } from "@context/AuthContext.jsx";

const PostEditOptions = ({ post, onEdit }) => {
  const [open, setOpen] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const ref = useRef(null);
  useOutsideClick(ref, () => setOpen(false));
  const { deletePostById } = useAuth()

  const handleDeletePost = async () => {
    try {
      setIsDeleting(true);
      await deletePost(post.id, post.username);
      deletePostById(post.id);
      // Remove post from UI by updating parent state
      // if (onPostDeleted) onPostDeleted(post.id);
    } catch (err) {
      alert("Failed to delete post");
    }finally {
      setIsDeleting(false);
      setShowDeletePopup(false);
    }
  };

  const handleEdit = () => {
    // open edit modal
    console.log("Edit post", post.id);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/user/posts/${post.id}`
    );
    alert("Link copied!");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <FiMoreHorizontal />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-50">
          <button
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
          >
            <FiEdit2 /> Edit caption
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
          >
            <FiShare /> Share
          </button>

          <button
            onClick={() => {
              setShowDeletePopup(true);
              setOpen(false);
            }}
            className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50"
          >
            <FiTrash2 /> Delete
          </button>
        </div>
      )}
      <ConfirmDeleteModal
        open={showDeletePopup}
        title="Delete post?"
        message="This post will be permanently deleted and cannot be recovered."
        isLoading={isDeleting}
        onCancel={() => setShowDeletePopup(false)}
        onConfirm={handleDeletePost}
      />
    </div>
  );
};

export default PostEditOptions;
