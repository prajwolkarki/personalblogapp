import connectToDatabase from "@/lib/db";
import Blog from "@/models/BlogPost";
import User from "@/models/User";

async function getBlogPosts(searchQuery = "", category = "") {
  try {
    await connectToDatabase();
    let query = {};
    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
      ];
    }
    if (category) {
      query.category = category;
    }
    const blogs = await Blog.find(query).populate("author", "name").lean();
    const serializedBlogs = blogs.map((blog) => ({
      ...blog,
      _id: blog._id.toString(), 
      createdAt: blog.createdAt?.toISOString(), 
      updatedAt: blog.updatedAt?.toISOString(),
      author: blog.author ? {
        ...blog.author,
        _id: blog.author._id.toString()
      } : null,
    }));

    return serializedBlogs;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

async function getLatestBlogs(limit = 5) {
  try {
    await connectToDatabase();
    const blogs = await Blog.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return blogs;
  } catch (error) {
    console.error("Error fetching latest blogs:", error);
    return [];
  }
}


export { getLatestBlogs, getBlogPosts };
