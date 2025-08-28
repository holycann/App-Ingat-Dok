"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { SideMenuLinks } from "./SideMenu";
import { useUserStore } from "@/store/userStore";
import { User } from "@/types/User";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";

// Sidebar component with improved type safety and performance
const SidebarComponent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loadUser, error } = useUserStore();
  const [open, setOpen] = useState(false);

  // Memoized user loading function to prevent unnecessary re-renders
  const fetchUser = useCallback(async () => {
    try {
      if (!user) {
        await loadUser();
      }
    } catch (error) {
      toast.error("Failed to load user", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }, [user, loadUser]);

  // Use effect with proper dependency management
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          {user ? (
            <SideMenuLinks open={open} user={user as User} />
          ) : (
            <Skeleton className="w-32 h-10" />
          )}
        </SidebarBody>
        <div className="w-full p-2">{children}</div>
      </Sidebar>
    </div>
  );
};

// Use default export with named component for better debugging
export default SidebarComponent;
