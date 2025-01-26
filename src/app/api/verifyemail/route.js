// app/api/verifyotp/route.js
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return Response.json(
      { error: "Verification token is required" },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      verificationCode: hashedToken,
      verificationCodeExpiry: { $gt: new Date() },
    });

    if (!user) {
      return Response.json(
        { error: "Invalid token or token has expired" },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiry = undefined;
    await user.save();

    return Response.json(
      { success: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification error:", error);
    return Response.json(
      { error: "Email verification failed" },
      { status: 500 }
    );
  }
}
