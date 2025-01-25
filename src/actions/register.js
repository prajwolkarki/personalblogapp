"use server";

import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { z } from "zod";
import bcrypt from "bcryptjs";

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
      createdAt: new Date()
    });

    await newUser.save();

    return {
      success: "User registered successfully",
      status: 201,
    };
  } catch (e) {
    console.error(e, "Registration error");
    return {
      error: "Internal server error",
      status: 500,
    };
  }
}