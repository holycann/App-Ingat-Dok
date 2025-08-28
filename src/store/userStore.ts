import { create } from "zustand";
import { persist } from "zustand/middleware";
import { userService } from "@/services/userService";
import { User } from "@/types/User";
import { toast } from "sonner";
import { isApiResponse } from "@/types/ApiResponse";

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  resetError: () => void;
  loadUser: () => Promise<void>;
  modifyUser: (userData: Partial<User>) => Promise<void>;
  removeUser: () => Promise<void>;
  setCurrentUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      resetError: () => set({ error: null }),

      setCurrentUser: (user) => set({ user }),

      loadUser: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await userService.getUser();

          if (isApiResponse(response) && response.success) {
            set({
              user: response.data,
              isLoading: false,
            });
          } else {
            throw new Error(response.message || "Failed to fetch user profile");
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to fetch user profile";

          set({
            user: null,
            isLoading: false,
            error: errorMessage,
          });

          toast.error(errorMessage);
        }
      },

      modifyUser: async (userData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await userService.updateUser(userData);

          if (isApiResponse(response) && response.success) {
            set({
              user: response.data,
              isLoading: false,
            });
            toast.success("Profile updated successfully");
          } else {
            throw new Error(response.message || "Failed to update profile");
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to update profile";

          set({
            isLoading: false,
            error: errorMessage,
          });

          toast.error(errorMessage);
        }
      },

      removeUser: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await userService.deleteUser();

          if (isApiResponse(response) && response.success) {
            set({
              user: null,
              isLoading: false,
            });
            toast.success("Account deleted successfully");
          } else {
            throw new Error(response.message || "Failed to delete account");
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to delete account";

          set({
            isLoading: false,
            error: errorMessage,
          });

          toast.error(errorMessage);
        }
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
