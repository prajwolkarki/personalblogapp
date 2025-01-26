// app/api/blogs/[id/route.js
import connectToDatabase from '@/lib/db';
import Blog from '@/models/BlogPost';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    await connectToDatabase();
   
    
    if (!id) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    const blog = await Blog.findById(id).populate("author", "name");
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ blog });

  } catch (error) {
    console.error('Error fetching blog:', error);
    
    return NextResponse.json(
      { error: 'An error occurred while fetching the blog' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  await connectToDatabase();

  try {
    const { id } = params;

    // Validate the ID
    if (!id) {
      return NextResponse.json(
        { error: "Blog ID is required for deletion." },
        { status: 400 }
      );
    }

    // Find and delete the blog post
    const deletedPost = await Blog.findByIdAndDelete(id);

    if (!deletedPost) {
      return NextResponse.json(
        { error: "Blog post not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Blog post deleted successfully.", post: deletedPost },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post." },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  await connectToDatabase();

  try {
    const { id } = await params;
    const body = await request.json();
    const { title, content, category, image } = body;

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: "Blog ID is required for updating." },
        { status: 400 }
      );
    }

    if (!title && !content && !category && !image) {
      return NextResponse.json(
        { error: "At least one field (title, content, category, or image) must be provided to update." },
        { status: 400 }
      );
    }

    // Create update object with only provided fields
    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (category) updateData.category = category;
    if (image) updateData.image = image;

    // Update the blog post
    const updatedPost = await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return NextResponse.json(
        { error: "Blog post not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Blog post updated successfully.", post: updatedPost },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post." },
      { status: 500 }
    );
  }
}
