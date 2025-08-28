"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  User,
  Edit2,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  const handleEdit = (section: string) => {
    // Placeholder for edit functionality
    console.log(`Editing ${section}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-background/80 rounded-2xl border border-border/50 shadow-lg overflow-hidden">
        {/* Profile Header */}
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
                <h1 className="text-2xl font-bold text-foreground">
                  Musharof Chowdhury
                </h1>
                <p className="text-sm text-muted-foreground">
                  Team Manager, Arizona, United States
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}

              <Button
                variant="outline"
                size="icon"
                onClick={() => handleEdit("profile")}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Personal Information
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit("personal-info")}
            >
              <Edit2 className="w-4 h-4 mr-2" /> Edit
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">First Name</p>
              <p className="text-sm font-medium">Musharof</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Last Name</p>
              <p className="text-sm font-medium">Chowdhury</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email address</p>
              <p className="text-sm font-medium">randomuser@pimjo.com</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-medium">+09 363 398 46</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground">Bio</p>
              <p className="text-sm font-medium">Team Manager</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Address Information */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-foreground">Address</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit("address")}
            >
              <Edit2 className="w-4 h-4 mr-2" /> Edit
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Country</p>
              <p className="text-sm font-medium">United States</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">City/State</p>
              <p className="text-sm font-medium">
                Phoenix, Arizona, United States
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Postal Code</p>
              <p className="text-sm font-medium">ERT 2489</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">TAX ID</p>
              <p className="text-sm font-medium">AS4568384</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
