import { create } from "zustand";
import { redirect } from "next/navigation";
import Cookies from "js-cookie";
import { isTokenExpired } from "@/lib/jwt";
import { toast } from "sonner";

const ACCESS_TOKEN_KEY = "access_token";
const TOKEN_EXPIRY_MINUTES = 60; // 1 hour

interface AuthState {
  session: string | null;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  checkAuthSession: () => Promise<boolean>;
  getAuthSession: () => string | null;
  setAuthSession: (session: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  session: null,
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  setAuthSession: (session) => {
    try {
      // Decode token to validate its structure
      const isExpired = isTokenExpired(session);

      if (isExpired) {
        toast.error("Invalid authentication token");
        return;
      }

      // Set cookie with secure options
      Cookies.set(ACCESS_TOKEN_KEY, session, {
        expires: new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000),
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      set({
        session,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to set authentication session";

      toast.error(errorMessage);
      set({
        session: null,
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  getAuthSession: () => {
    try {
      const currentSession = Cookies.get(ACCESS_TOKEN_KEY);

      if (!currentSession) {
        return null;
      }

      // Decode and validate token
      const isExpired = isTokenExpired(currentSession);

      if (isExpired) {
        return null;
      }

      return currentSession;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to retrieve authentication session";

      toast.error(errorMessage);
      return null;
    }
  },

  checkAuthSession: async () => {
    set({ isLoading: true, error: null });

    try {
      const currentSession = Cookies.get(ACCESS_TOKEN_KEY);

      if (!currentSession) {
        set({ isLoading: false });
        return false;
      }

      // Decode and validate token
      const isExpired = isTokenExpired(currentSession);

      if (isExpired) {
        Cookies.remove(ACCESS_TOKEN_KEY);
        set({
          session: null,
          isLoading: false,
          error: "Authentication token expired",
        });
        return false;
      }

      set({
        session: currentSession,
        isLoading: false,
      });
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Authentication check failed";

      set({
        session: null,
        isLoading: false,
        error: errorMessage,
      });
      return false;
    }
  },

  logout: () => {
    // Remove authentication token
    Cookies.remove(ACCESS_TOKEN_KEY);

    // Reset store state
    set({
      session: null,
      error: "Session expired",
      isLoading: false,
    });

    // Redirect to logout page
    redirect(
      `${process.env.NEXT_PUBLIC_AUTH_URL}/logout?redirect_url=${process.env.NEXT_PUBLIC_REDIRECT_AUTH_URL}`
    );
  },
}));
