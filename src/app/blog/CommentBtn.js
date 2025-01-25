'use client';

import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const CommentBtn = ({ blog }) => {
  const bg = JSON.parse(blog);
  const [commentCount, setCommentCount] = useState(bg.comments?.length || 0);
  const [commentText, setCommentText] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleComment = async () => {
    if (!commentText.trim()) {
      alert('Please enter a comment.');
      return;
    }

    try {
      const response = await fetch(`/api/blogs/${bg._id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment: commentText }),
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      await response.json();
      setCommentCount((prev) => prev + 1);
      setCommentText('');
      setIsOpen(false);
      alert('Comment posted successfully!');
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1 p-0">
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm">{commentCount}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a Comment</DialogTitle>
          <DialogDescription>
            Write your comment below. Click post when you're done.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write your comment..."
          className="min-h-[100px]"
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleComment}>Post Comment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CommentBtn;
