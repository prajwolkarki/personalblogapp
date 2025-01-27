import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BLOG_CATEGORIES } from "@/lib/config";
import { getBlogPosts, getLatestBlogs } from "./blogServerFunctions";
import ThumbsUpBtn from "./ThumbsUpBtn";
import CommentBtn from "./CommentBtn";
import ShareBtn from "./ShareBtn";

export default async function BlogPage({ searchParams }) {
  const searchQuery = (await searchParams)?.search || "";
  const category = (await searchParams)?.category || "";
  const blogs = await getBlogPosts(searchQuery, category);
  const latestBlogs = await getLatestBlogs();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-start md:text-4xl">Blogs</h1>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
        {/* Left Section - Blogs */}
        <div className="lg:col-span-3">
          {!blogs || blogs.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-500">No blogs found.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {blogs.map((blog) => (
                <Card
                  key={blog._id}
                  className="hover:shadow-xl transition-shadow flex flex-col md:flex-row"
                >
                  {/* Image on the Left (Square Aspect Ratio) */}
                  <div className="w-full md:w-1/6 md:aspect-square">
                    <img
                      src={blog.image || "/images/placeholder.svg"} // Use a default image if none is provided
                      alt={blog.title}
                      className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                    />
                  </div>

                  {/* Content on the Right */}
                  <div className="w-full p-4 flex flex-col justify-between">
                    <CardHeader className="p-0">
                      <CardTitle className="truncate text-lg md:text-xl">
                        {blog.title}
                      </CardTitle>
                      <CardDescription className="text-sm md:text-base">
                        {new Date(blog.createdAt).toLocaleDateString()} •{" "}
                        {blog.author?.name || "Unknown Author"}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="p-0 flex flex-wrap items-center justify-between mt-4">
                      <div className="flex items-center gap-4">
                        <Badge>{blog.category}</Badge>
                        <ThumbsUpBtn blog={JSON.stringify(blog)} />
                        <CommentBtn blog={JSON.stringify(blog)} />
                        <ShareBtn blog={JSON.stringify(blog)} />
                      </div>
                      <Link href={`/blog/${blog._id}`}>
                        <Button variant="link" className="ml-auto">
                          Read More
                        </Button>
                      </Link>
                    </CardFooter>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Section - Categories and Latest Blogs */}
        <div className="lg:col-span-1 space-y-8">
          {/* Top - Categories */}
          <div>
            <h2 className="text-xl font-semibold mb-4 md:text-2xl">
              Categories
            </h2>
            <div className="flex flex-wrap gap-2">
              {BLOG_CATEGORIES.map((cat) => (
                <Link
                  key={cat.key}
                  href={`/blog?category=${cat.key}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    category === cat.key
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {cat.value}
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom - Latest Blogs */}
          <div>
            <h2 className="text-xl font-semibold mb-4 md:text-2xl">
              Latest Blogs
            </h2>
            <div className="space-y-4">
              {latestBlogs.map((blog) => (
                <Link key={blog._id} href={`/blog/${blog._id}`}>
                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <h3 className="font-medium truncate">{blog.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
