'use client';

import React from "react";
import { Share2 } from "lucide-react";

const ShareBtn = ({ blog }) => {
  const bg = JSON.parse(blog);
  const handleShare = () => {
    const shareLink = `${window.location.origin}/blog/${bg._id}`;
    navigator.clipboard
      .writeText(shareLink)
      .then(() => alert("Blog link copied to clipboard!"))
      .catch((err) => console.error("Failed to copy link:", err));
  };

  return (
    <button
      className="flex items-center gap-1 text-gray-600 hover:text-blue-500"
      onClick={handleShare}
    >
      <Share2 className="w-4 h-4" />
      <span className="text-sm">Share</span>
    </button>
  );
};

export default ShareBtn;
