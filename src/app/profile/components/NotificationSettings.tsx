import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const NotificationSettings: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleEmailNotificationToggle = () => {
    setEmailNotifications(!emailNotifications);
    // TODO: Implement actual notification setting update in backend
  };

  const handlePushNotificationToggle = () => {
    setPushNotifications(!pushNotifications);
    // TODO: Implement actual notification setting update in backend
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Notification Settings
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notifications" className="text-sm">
            Email Notifications
          </Label>
          <Switch
            id="email-notifications"
            checked={emailNotifications}
            onCheckedChange={handleEmailNotificationToggle}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="push-notifications" className="text-sm">
            Push Notifications
          </Label>
          <Switch
            id="push-notifications"
            checked={pushNotifications}
            onCheckedChange={handlePushNotificationToggle}
          />
        </div>
      </div>
    </div>
  );
};
