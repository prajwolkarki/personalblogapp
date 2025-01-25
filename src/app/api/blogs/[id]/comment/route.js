import { connectToDatabase } from "@/lib/db";
import Blog from "@/models/BlogPost";
import { verifyAuth } from "@/lib/auth";

export async function POST(request) {
  try {
    const token = request.cookies.get('token')?.value;
    const user = await verifyAuth(token);

    if (!user) {
      return new Response(JSON.stringify({ message: "Not authenticated" }), {
        status: 401,
      });
    }

    await connectToDatabase();

    const { id } = request.params;
    const { text } = await request.json();

    if (!text || text.trim().length === 0) {
      return new Response(JSON.stringify({ message: "Comment text is required" }), {
        status: 400,
      });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return new Response(JSON.stringify({ message: "Blog not found" }), {
        status: 404,
      });
    }

    blog.comment.push({
      user: user.userId,
      text: text.trim()
    });

    await blog.save();

    return new Response(
      JSON.stringify({ 
        message: "Comment added successfully",
        comment: blog.comment[blog.comment.length - 1]
      }),
      { status: 201 }
    );

  } catch (error) {
    console.error("Error adding comment:", error);
    return new Response(
      JSON.stringify({ message: "Error adding comment" }), 
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectToDatabase();

    const { id } = request.params;
    
    const blog = await Blog.findById(id)
      .populate({
        path: 'comment.user',
        select: 'userName email'
      });

    if (!blog) {
      return new Response(JSON.stringify({ message: "Blog not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ comments: blog.comment }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching comments:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching comments" }), 
      { status: 500 }
    );
  }
}
