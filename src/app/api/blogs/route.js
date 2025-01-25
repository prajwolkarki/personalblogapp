import connectToDatabase from "@/lib/db";
import Blog from "@/models/BlogPost";
import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  await connectToDatabase();

  try {
    // Retrieve the token from cookies
    const token = (await cookies()).get("token")?.value;

    // Verify the token and get the authenticated user
    const user = await verifyAuth(token);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch blogs created by the authenticated author
    const blogs = await Blog.find({ author: user.userId })
      .sort({ createdAt: -1 })
      .populate("author", "name");

    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ error: "Failed to fetch blogs." }, { status: 500 });
  }
}

export async function POST(req) {
  const token = (await cookies()).get("token")?.value;
  const user = await verifyAuth(token);
  await connectToDatabase();

  try {
    const body = await req.json();
    const { title, content, category, image } = body;

    // Validate required fields
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "Title, content, and category are required." },
        { status: 400 }
      );
    }

    // Create a new blog post
    const newPost = await Blog.create({
      title,
      content,
      category,
      image,
      author: user.userId, 
    });

    return NextResponse.json(
      { message: "Blog post created successfully.", post: newPost },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json({ error: error.message || "Failed to create blog post." }, { status: 500 });
  }
}
