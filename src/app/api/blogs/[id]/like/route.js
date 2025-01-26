import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Blog from "@/models/BlogPost";
import { cookies } from "next/headers";
import { verifyAuth } from "@/lib/auth";
import mongoose from "mongoose"; 

export async function POST(request, { params }) {
  const { id } = await params; // Remove await here

  try {
    const token = (await cookies()).get("token")?.value;
    const user = await verifyAuth(token);

    if (!user) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    await connectToDatabase();
    
    // Convert to ObjectId
    const userId = new mongoose.Types.ObjectId(user.userId); 
    //console.log(userId);

    const blog = await Blog.findById(id);
    //console.log(blog);
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    // Initialize likedBy if missing
    if (!blog.likedBy) blog.likedBy = [];

    // Convert existing IDs to strings for comparison
    const hasLiked = blog.likedBy.some(likedId => 
      likedId.toString() === userId.toString()
    );

    if (hasLiked) {
      blog.likes -= 1;
      blog.likedBy = blog.likedBy.filter(
        likedId => likedId.toString() !== userId.toString()
      );
    } else {
      blog.likes += 1;
      blog.likedBy.push(userId); // Now pushing ObjectId
    }

    await blog.save();
    // console.log(blog);

    return NextResponse.json(
      { likes: blog.likes, hasLiked: !hasLiked },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}