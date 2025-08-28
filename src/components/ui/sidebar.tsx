"use client";
import { cn } from "@/lib/utils";
import React, { 
  useState, 
  createContext, 
  useContext, 
  useMemo, 
  ReactNode, 
  Dispatch, 
  SetStateAction 
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";

// Improved type definitions
export interface SidebarLink {
  label: string;
  href: string;
  icon: ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  animate: boolean;
}

// Create a context with more explicit typing
const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

// Custom hook with improved error handling
export const useSidebar = (): SidebarContextProps => {
  const context = useContext(SidebarContext);
  
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  
  return context;
};

// Improved SidebarProvider with more robust prop handling
interface SidebarProviderProps {
  children: ReactNode;
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  animate?: boolean;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}) => {
  const [openState, setOpenState] = useState(false);

  // Use useMemo to memoize derived values
  const contextValue = useMemo(() => ({
    open: openProp ?? openState,
    setOpen: setOpenProp ?? setOpenState,
    animate,
  }), [openProp, openState, setOpenProp, animate]);

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );
};

// Sidebar component with explicit typing
interface SidebarProps {
  children: ReactNode;
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  animate?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  children,
  open,
  setOpen,
  animate,
}) => {
  return (
    <SidebarProvider 
      open={open} 
      setOpen={setOpen} 
      animate={animate}
    >
      {children}
    </SidebarProvider>
  );
};

// SidebarBody component with improved type handling
export const SidebarBody: React.FC<React.ComponentProps<typeof motion.div>> = (props) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

// DesktopSidebar with improved type safety
export const DesktopSidebar: React.FC<React.ComponentProps<typeof motion.div>> = ({
  className,
  children,
  ...props
}) => {
  const { open, setOpen, animate } = useSidebar();
  
  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 w-[300px] shrink-0",
        className
      )}
      animate={{
        width: animate ? (open ? "300px" : "60px") : "300px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// MobileSidebar with improved type safety
export const MobileSidebar: React.FC<React.ComponentProps<"div">> = ({
  className,
  children,
  ...props
}) => {
  const { open, setOpen } = useSidebar();
  
  return (
    <div
      className={cn(
        "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full"
      )}
      {...props}
    >
      <div className="flex justify-end z-20 w-full">
        <Menu
          className="text-neutral-800 dark:text-neutral-200"
          onClick={() => setOpen(!open)}
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className={cn(
              "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between",
              className
            )}
          >
            <div
              className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200"
              onClick={() => setOpen(!open)}
            >
              <X />
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// SidebarLink with improved type safety
interface SidebarLinkProps {
  link: SidebarLink;
  className?: string;
}

export const SidebarLink: React.FC<SidebarLinkProps> = ({
  link,
  className,
  ...props
}) => {
  const { open, animate } = useSidebar();
  
  return (
    <a
      href={link.href}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2",
        className
      )}
      {...props}
    >
      {link.icon}

      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </a>
  );
};