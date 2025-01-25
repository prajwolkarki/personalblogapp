'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'react-hot-toast';
import { CalendarDays, Tag, ArrowLeft, User } from 'lucide-react';
import 'react-quill-new/dist/quill.snow.css'; // Import Quill styles

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
        const response = await fetch(`/api/blogs/${blogId}`);
        if (!response.ok) throw new Error('Failed to fetch blog');
        const data = await response.json();
        setBlog(data.blog);
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
                  <span>{blog.author.name}</span>
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

              {/* Content Area with Quill Styling */}
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

              <div className="flex justify-center pt-8">
                <Button
                  onClick={() => router.push('/blog')}
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