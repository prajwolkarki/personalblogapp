"use server";

import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/mail";
import crypto from "crypto";
import { NextResponse } from "next/server";

const schema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
});

export async function registerUserAction(formData) {
  const validatedFields = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors[0].message,
      status: 400,
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        error: "User already exists",
        status: 400,
      };
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashPassword,
      createdAt: new Date(),
    });
    // Generate a secure reset token
    const verifytoken = crypto.randomBytes(32).toString("hex");

    // Hash the token before saving to database
    const hashedToken = crypto
      .createHash("sha256")
      .update(verifytoken)
      .digest("hex");

    // Save the hashed token and expiry time
    newUser.verificationCode = hashedToken;
    newUser.verificationCodeExpiry = new Date(Date.now() + 3600000); // 1 hour
  
    // Send verification email with the verification link and expiry time
    await newUser.save();
    const emailDomain = email.split("@")[1];
   // console.log(emailDomain);
    const verificationLink = `http://localhost:3000/verifyemail?token=${verifytoken}`;
    const emailContent = `
    Hello ${name},
    
    Thank you for registering with us! Please verify your email address by clicking the link below:
    
    ${verificationLink}
    
    This link will expire in 1 hour.
    
    If you didn't create an account, please ignore this email.
    
    Best regards,
    ब्लग संसार
  `;

  try {
    await sendEmail({
      to: email,
      subject: "Verify your email address",
      text: emailContent,
    });
  } catch (e) {
    console.error(e, "Email sending error");
    return {
      error: "Failed to send verification email",
      status: 500,
    };
  }
    return {
      success: "User registered successfully",
      status: 201,
      token: verifytoken,
      emailDomain:emailDomain
    };
  } catch (e) {
    console.error(e, "Registration error");
    return {
      error: "Internal server error",
      status: 500,
    };
  }
}
