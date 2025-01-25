'use client'
import React, { useState } from "react";
import { ThumbsUp } from "lucide-react";

const ThumbsUpBtn = ({ blog }) => {
  
  const bg = JSON.parse(blog);
  const [likes, setLikes] = useState(bg.likes || 0);
  const handleLike = async () => {
    try {
      const response = await fetch(`/api/blogs/${bg._id}/like`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to like the blog");
      }

      const data = await response.json();
      setLikes(data.likes); 
    } catch (error) {
      console.error("Error liking the blog:", error);
    }
  };

  return (
   
    <div
      className="flex items-center gap-1 cursor-pointer"
      onClick={handleLike}
    >
        
      <ThumbsUp className="w-4 h-4" />
      <span className="text-sm">{likes}</span>
    </div>
  );
};

export default ThumbsUpBtn;