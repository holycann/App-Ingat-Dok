import { create } from "zustand";
import type { Notification } from "@/types/Notification";
import { toast } from "sonner";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  settings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    reminderDays: number;
  };
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  updateSettings: (
    settings: Partial<NotificationState["settings"]>
  ) => Promise<void>;
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt">
  ) => void;
  resetError: () => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  settings: {
    emailNotifications: true,
    pushNotifications: true,
    reminderDays: 30,
  },

  resetError: () => set({ error: null }),

  fetchNotifications: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In a real-world scenario, replace this with an actual API call
      const mockNotifications: Notification[] = [
        {
          id: "1",
          type: "reminder",
          title: "SIM akan berakhir",
          message: "SIM A Anda akan berakhir dalam 30 hari",
          documentId: "1",
          isRead: false,
          createdAt: new Date(),
        },
        {
          id: "2",
          type: "success",
          title: "Dokumen berhasil diproses",
          message: "STNK Motor Honda telah berhasil dianalisis",
          documentId: "2",
          isRead: false,
          createdAt: new Date(Date.now() - 3600000),
        },
      ];

      set({
        notifications: mockNotifications,
        unreadCount: mockNotifications.filter((n) => !n.isRead).length,
        isLoading: false,
      });

      toast.success("Notifications fetched successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch notifications";

      set({
        notifications: [],
        unreadCount: 0,
        isLoading: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
    }
  },

  markAsRead: async (id) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 200));

      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
        isLoading: false,
      }));

      toast.success("Notification marked as read");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to mark notification as read";

      set({
        isLoading: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
    }
  },

  updateSettings: async (newSettings) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => ({
        settings: { ...state.settings, ...newSettings },
        isLoading: false,
      }));

      toast.success("Notification settings updated");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update notification settings";

      set({
        isLoading: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
    }
  },

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));

    // Optional: Show toast for new notification
    toast(newNotification.title, {
      description: newNotification.message,
    });
  },
}));
