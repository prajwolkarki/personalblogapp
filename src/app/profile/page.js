"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/profile", {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        router.push("/login"); 
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <div className="flex flex-col items-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold">
          {user.userName?.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-3xl font-semibold">{user.userName}</h1>
        <p className="text-gray-600">{user.email}</p>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-gray-600">User ID:</h3>
            <p className="text-gray-800">{user.userId}</p>
          </div>
          <div>
            <h3 className="text-gray-600">Email:</h3>
            <p className="text-gray-800">{user.email}</p>
          </div>
          <div>
            <h3 className="text-gray-600">Username:</h3>
            <p className="text-gray-800">{user.userName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
