"use client";

import { Suspense } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import { isTokenExpired } from "@/lib/jwt";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthSession, logout } = useAuthStore();
  const { loadUser } = useUserStore();
  const token = searchParams.get("token");

  useEffect(() => {
    const handleAuthentication = async () => {
      try {
        if (!token) {
          // No token provided
          toast.error("Authentication failed: No token received");
          router.push(
            `${process.env.NEXT_PUBLIC_AUTH_URL}/?redirect_url=${process.env.NEXT_PUBLIC_REDIRECT_AUTH_URL}`
          );
          return;
        }

        // Decode token to check its validity
        const isExpired = isTokenExpired(token);
        if (isExpired) {
          toast.error("Authentication token expired");
          logout();
          return;
        }

        // Set the authentication session
        setAuthSession(token);

        // Load user information
        await loadUser();

        // Redirect to home page on successful authentication
        router.push("/");
      } catch (error) {
        console.log("error:", error);
        // Handle any unexpected errors during authentication
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred during authentication";

        toast.error(errorMessage);
        logout();
      }
    };

    handleAuthentication();
  }, [token, setAuthSession, loadUser, logout]);

  return null;
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
