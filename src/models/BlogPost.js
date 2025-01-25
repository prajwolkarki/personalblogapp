import mongoose from "mongoose";


const commentSchema = new mongoose.Schema({
      text: String,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now },
    });
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      minlength: [2, "Title must be at least 2 characters long."],
      maxlength: [100, "Title must not exceed 100 characters."],
      index:'text'
    },
    content: {
      type: String,
      required: [true, "Content is required."],
      minlength: [10, "Content must be at least 10 characters long."],
      index:'text'
    },
    category: {
      type: String,
      required: [true, "Category is required."],
    },
    image: {
      type: String,
      default: null, 
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    likes:{
      type: Number,
      default: 0
    },
    likedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    comments:[commentSchema]
  },
  {
    timestamps: true, 
  }
);

blogSchema.index({ title: 'text', content: 'text' });

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);
