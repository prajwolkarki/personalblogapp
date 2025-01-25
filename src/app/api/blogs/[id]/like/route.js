import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Blog from "@/models/BlogPost";

export async function POST(request, { params }) {
  const { id } = await params;

  try {
    await connectToDatabase();
    const blog = await Blog.findById(id);

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    blog.likes += 1;
    await blog.save();

    return NextResponse.json({ likes: blog.likes }, { status: 200 });
  } catch (error) {
    console.error("Error liking blog:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}