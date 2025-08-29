"use client";

import React, { useCallback, useEffect } from "react";
import { ProfileHeader } from "./components/ProfileHeader";
import { PersonalInformation } from "./components/PersonalInformation";
import { NotificationSettings } from "./components/NotificationSettings";
import { AccountDeletion } from "./components/AccountDeletion";
import { useUserStore } from "@/store/userStore";

export default function ProfilePage() {
  const { user, loadUser } = useUserStore();

  const fetchUser = useCallback(async () => {
    await loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user, fetchUser]);

  const handleEdit = (section: string) => {
    // Placeholder for edit functionality
    console.log(`Editing ${section}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-background/80 rounded-2xl border border-border/50 shadow-lg overflow-hidden">
        <ProfileHeader
          username={user?.fullname || ""}
          email={user?.email || ""}
          onEdit={handleEdit}
        />

        <PersonalInformation
          fullname={user?.fullname || ""}
          email={user?.email || ""}
          phone={user?.phone || ""}
          address={user?.address || ""}
          onEdit={handleEdit}
        />

        <NotificationSettings />
        <AccountDeletion />
      </div>
    </div>
  );
}
