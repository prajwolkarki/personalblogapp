"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { toast } from "react-hot-toast";
import { CalendarDays, Tag, ArrowLeft, User } from "lucide-react";
import "react-quill-new/dist/quill.snow.css";

export default function BlogDetailPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.id;

  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${blogId}`);
        if (!response.ok) throw new Error("Failed to fetch blog");
        const data = await response.json();
        setBlog(data.blog || null); // Ensure blog is set to null if data.blog is undefined
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (blogId) fetchBlog();
  }, [blogId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl">
          <CardHeader className="space-y-4">
            <Skeleton className="h-10 w-3/4 mx-auto" />
            <div className="flex justify-center gap-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-64 w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-6">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-red-600">Error</h1>
            <p className="text-gray-600">{error}</p>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-6">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Blog Not Found</h1>
            <Button onClick={() => router.push("/blog")} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Posts
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <ScrollArea className="h-screen">
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Card className="border-none shadow-none">
            <CardHeader className="space-y-4 pb-4">
              <h1 className="text-4xl font-bold text-center">{blog.title}</h1>
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{blog.author?.name || 'Unknown Author'}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
                <Badge variant="secondary" className="gap-2">
                  <Tag className="h-4 w-4" />
                  {blog.category}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              {blog.image && (
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <Separator className="my-8" />
              <div
                className="ql-editor prose prose-lg max-w-none 
                  [&_ol]:list-decimal [&_ul]:list-disc
                  [&_ol]:pl-8 [&_ul]:pl-8
                  [&_li]:my-2
                  [&_h1]:text-3xl [&_h2]:text-2xl [&_h3]:text-xl
                  [&_img]:rounded-lg [&_img]:shadow-lg [&_img]:my-4
                  [&_a]:text-primary hover:[&_a]:underline
                  [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-lg
                  [&_blockquote]:border-l-4 [&_blockquote]:border-primary
                  [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              <div className="space-y-8 mt-12">
                <h2 className="text-2xl font-bold">
                  Responses ({blog.comments?.length || 0})
                </h2>

                <div className="border rounded-lg p-6 shadow-sm">
                  <h3 className="font-medium mb-4">What are your thoughts?</h3>
                  <form
                    className="space-y-4"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const comment = formData.get("comment");

                      try {
                        const response = await fetch(
                          `/api/blogs/${blogId}/comment`,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ comment }),
                          }
                        );

                        if (!response.ok)
                          throw new Error("Failed to post comment");

                        const updatedResponse = await fetch(
                          `/api/blogs/${blogId}/comment`
                        );
                        const updatedData = await updatedResponse.json();

                        setBlog(updatedData.blog);

                        e.target.reset();
                        toast.success("Comment posted!");
                      } catch (err) {
                        toast.error(err.message);
                      }
                    }}
                  >
                    <textarea
                      name="comment"
                      placeholder="Write your response..."
                      className="w-full p-4 border rounded-lg min-h-[100px] focus:ring-2 focus:ring-primary"
                      required
                    />
                    <div className="flex justify-end">
                      <Button type="submit">Post Response</Button>
                    </div>
                  </form>
                </div>

                <div className="space-y-6">
                  {blog.comments?.map((comment) => (
                    <div
                      key={comment._id}
                      className="border-l-2 border-gray-200 pl-4 dark:border-gray-700"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-9 w-9 border-2 border-black rounded-full dark:border-gray-600">
                          {comment.user?.image ? (
                            <AvatarImage
                              src={comment.user.image}
                              alt={comment.user.name}
                              className="rounded-full"
                            />
                          ) : (
                            <AvatarFallback className="bg-black text-white dark:bg-gray-800 flex items-center justify-center h-full rounded-full text-sm font-medium">
                              {comment.user?.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          )}
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-semibold">
                              {comment.user?.name || 'Unknown User'}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(comment.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center pt-8">
                <Button
                  onClick={() => router.push("/blog")}
                  variant="outline"
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to All Posts
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
