import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isVerified:{
    type: Boolean,
    default: false,
  },
  verificationCode: String,
  verificationCodeExpiry: Date,
  resetToken: String,
  resetTokenExpiry: Date,
});

export default mongoose.models.User || mongoose.model("User", UserSchema);