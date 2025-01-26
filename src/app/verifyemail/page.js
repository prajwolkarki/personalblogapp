// app/verifyemail/page.jsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState({
    isLoading: true,
    error: null,
    success: null
  });

  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (!token) {
          throw new Error("Invalid or missing token.");
        }

        const response = await fetch(`/api/verifyemail?token=${token}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Verification failed");
        }

        setStatus({
          isLoading: false,
          error: null,
          success: data.success
        });
      } catch (error) {
        setStatus({
          isLoading: false,
          error: error.message,
          success: null
        });
      }
    };

    verifyToken();
  }, [token]);

  if (status.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-xl font-bold">Verifying...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {status.success ? (
        <>
          <h1 className="text-xl font-bold text-green-600">
            {status.success} 🎉
          </h1>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </>
      ) : (
        <>
          <h1 className="text-xl font-bold text-red-600">{status.error}</h1>
          <p className="mt-4">Please try again or contact support.</p>
        </>
      )}
    </div>
  );
}