"use client";
import React, { useState, useMemo, useCallback, ReactElement } from "react";
import { SidebarLink } from "@/components/ui/sidebar";
import {
  Home,
  FileText,
  Bell,
  Settings,
  UserRound,
  LogOut,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { User } from "@/types/User";

// Improved type definitions
interface MenuLink {
  label: string;
  href: string;
  icon: ReactElement;
  active?: boolean;
}

// Utility function for creating menu links with improved type safety
const createMenuLinkConfig = (
  label: string,
  href: string,
  Icon: React.ComponentType<{ className?: string }>,
  active?: boolean
): MenuLink => ({
  label,
  href,
  icon: (
    <Icon className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
  ),
  active,
});

// Memoized menu link configurations
const useMenuLinks = () => {
  const topLinks = useMemo<MenuLink[]>(
    () => [
      createMenuLinkConfig("Dashboard", "/", Home, true),
      createMenuLinkConfig("Documents", "/documents", FileText),
      createMenuLinkConfig("Notifications", "/notifications", Bell),
    ],
    []
  );

  const bottomLinks = useMemo<MenuLink[]>(
    () => [
      createMenuLinkConfig("Settings", "/settings", Settings),
      createMenuLinkConfig("Logout", "/logout", LogOut),
    ],
    []
  );

  return { topLinks, bottomLinks };
};

// Logo component with improved memoization
export const Logo: React.FC<{ open?: boolean }> = React.memo(
  ({ open = true }) => {
    return (
      <a
        href="/"
        className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black hover:text-primary-accent_lime transition-colors duration-300 group"
      >
        <img
          src="/images/Logo.png"
          alt="IngatDok Logo"
          className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm"
        />
        {open && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-medium whitespace-pre text-black dark:text-white group-hover:text-primary-accent_lime transition-colors duration-300"
          >
            IngatDok
          </motion.span>
        )}
      </a>
    );
  }
);

// Reusable link rendering function with improved type safety
const renderMenuLinks = (
  links: MenuLink[],
  activeLink: string,
  setActiveLink: (href: string) => void
) =>
  links.map((link, idx) => (
    <div key={idx} onClick={() => setActiveLink(link.href)} className="group">
      <SidebarLink
        link={{
          href: link.href,
          icon: React.cloneElement(link.icon, {
            className: cn(
              (link.icon.props as React.SVGProps<SVGSVGElement>).className,
              activeLink === link.href
                ? "text-primary-accent_lime"
                : "group-hover:text-primary-accent_lime transition-colors duration-300"
            ),
          }),
          label: link.label,
        }}
        className={cn(
          "transition-all duration-300 ease-in-out rounded-2xl p-1",
          activeLink === link.href
            ? "bg-primary-accent_lime bg-opacity-20 text-primary-accent_lime"
            : "hover:bg-primary-accent_lime hover:bg-opacity-10 hover:text-primary-accent_lime"
        )}
      />
    </div>
  ));

// Main sidebar menu component with improved state management
export const SideMenuLinks: React.FC<{
  open: boolean;
  user: User;
}> = ({ open, user }) => {
  const [activeLink, setActiveLink] = useState("");
  const { topLinks, bottomLinks } = useMenuLinks();

  // Memoized active link setter to prevent unnecessary re-renders
  const handleSetActiveLink = useCallback((href: string) => {
    setActiveLink(href);
  }, []);

  return (
    <div className="flex flex-1 flex-col justify-between overflow-x-hidden overflow-y-auto">
      <div>
        <Logo open={open} />
        <div className="mt-8 flex flex-col gap-2">
          {renderMenuLinks(topLinks, activeLink, handleSetActiveLink)}
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2 mb-4">
        <div className="group">
          <SidebarLink
            link={{
              label: user?.fullname || "Guest",
              href: "/profile",
              icon: (
                <div className="h-7 w-7 shrink-0 rounded-full bg-primary-brand_green flex items-center justify-center group-hover:bg-primary-accent_lime transition-colors duration-300">
                  <UserRound className="h-4 w-4 text-navigation-nav_background group-hover:text-white transition-colors duration-300" />
                </div>
              ),
            }}
            className="group-hover:text-primary-accent_lime transition-colors duration-300"
          />
        </div>

        {renderMenuLinks(bottomLinks, activeLink, handleSetActiveLink)}
      </div>
    </div>
  );
};
