import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";
import { sendEmail } from "@/lib/mail";

export async function POST(request) {
  const { email } = await request.json();

  try {
    await connectToDatabase();

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save the hashed token and expiry time in the database
    user.resetToken = hashedToken;
    user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // Send the reset link to the user's email
    const resetLink = `${process.env.NEXT_PUBLIC_API_URL}/reset-password?token=${resetToken}`;
    const emailContent = `
      Hello,
      
      You requested a password reset. Click the link below to reset your password:
      
      ${resetLink}
      
      This link will expire in 1 hour.
      
      If you didn't request this, please ignore this email.
      
      Best regards,
      ब्लग संसार
    `;

    await sendEmail({
      to: email,
      subject: "Password Reset Request",
      text: emailContent,
    });

    return Response.json({
      success: true,
      message: "Password reset link sent to your email.",
    });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
