import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Edit2 } from "lucide-react";

interface ProfileHeaderProps {
  username: string;
  email: string;
  onEdit: (section: string) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  username,
  email,
  onEdit,
}) => {
  return (
    <div className="relative bg-gradient-to-r from-primary/10 to-secondary/10 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Avatar className="w-24 h-24 border-4 border-background">
            <AvatarImage src="" alt="Profile Picture" />
            <AvatarFallback className="bg-muted text-muted-foreground">
              <User className="w-12 h-12" />
            </AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-2xl font-bold text-foreground">{username}</h1>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={() => onEdit("profile")}>
            <Edit2 className="w-4 h-4 mr-2" /> Edit
          </Button>
        </div>
      </div>
    </div>
  );
};
