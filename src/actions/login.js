"use server";

import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
});

export async function loginUserAction(formData) {
  const validatedFields = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors[0].message,
      status: 400,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    await connectToDatabase();

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return {
        error: "Invalid credentials",
        status: 401,
      };
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return {
        error: "Invalid credentials",
        status: 401,
      };
    }

    // Generate token
    const userToken = await new SignJWT({
      userId: user._id.toString(),
      email: user.email,
      userName: user.name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

      (await cookies()).set("token", userToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7200,
        path: "/",
      });
  
    return {
      success: "Logged in successfully",
      status: 200,
    };
  } catch (e) {
    console.error(e, "Login error");
    return {
      error: "Internal server error", 
      status: 500,
    };
  }
}