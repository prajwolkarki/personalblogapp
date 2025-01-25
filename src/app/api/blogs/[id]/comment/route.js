//api/blogs/[id]/comment/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Blog from '@/models/BlogPost';
import { cookies } from 'next/headers';
import { verifyAuth } from '@/lib/auth';

// In your blog post route (GET /api/blogs/[id])
export async function GET(request, { params }) {
  const { id } = await params;

  try {
    await connectToDatabase();
    
    const blog = await Blog.findById(id)
      .populate('author', 'name') // Populate author if needed
      .populate({
        path: 'comments.user',
        select: 'name' // Populate comment users
      })
      .exec();

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function POST(request,{ params }) {
  const { id } = await params;

  try {
    const token = (await cookies()).get('token')?.value;
    const user = await verifyAuth(token);

    if (!user) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    await connectToDatabase();

    const { comment } = await request.json(); 

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    blog.comments.push({
      text: comment,
      user: user.userId, 
      createdAt: new Date(),
    });

    await blog.save();

    return NextResponse.json({ message: 'Comment added successfully' });
  } catch (error) {
    console.error('Error posting comment:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}