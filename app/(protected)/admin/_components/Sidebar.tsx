"use client";

import { cn } from "@/lib/utils";
import {
  Home,
  Settings,
  Gamepad,
  Newspaper,
  Users,
  ChartNoAxesCombined,
  Mail,
  BadgeDollarSign,
  Podcast,
  BookType
} from "lucide-react";
import { UserRole } from "@/types";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/better-auth/client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";

interface SidebarProps {
  open: boolean;
}

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

const Sidebar = ({ open }: SidebarProps) => {
  const { data: session, isPending } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => await authClient.getSession(),
  });
  const user = session?.data?.user;
  const pathname = usePathname();

  const sidebarItems: SidebarItem[] = [
    {
      name: "Overview",
      href: "/admin",
      icon: Home,
      roles: ["admin"],
    },
    {
      name: "Predictions",
      href: "/admin/predictions",
      icon: Gamepad,
      roles: [
        "admin",
        "football_manager",
        "basketball_manager",
        "football_staff",
        "basketball_staff",
      ],
    },
    {
      name: "Subscription",
      href: "/admin/subscription",
      icon: Podcast,
      roles: ["admin"],
    },
    {
      name: "Blog",
      href: "/admin/blogs",
      icon: BookType,
      roles: ["admin", "blog_manager", "blog_staff"],
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      roles: ["admin"],
    },
    {
      name: "Finance",
      href: "/admin/finance",
      icon: BadgeDollarSign,
      roles: ["admin"],
    },
    {
      name: "Pages",
      href: "/admin/pages",
      icon: Newspaper,
      roles: ["admin", "seo_manager"],
    },
    {
      name: "Mail",
      href: "/admin/mails",
      icon: Mail,
      roles: ["admin"],
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: ChartNoAxesCombined,
      roles: ["admin"],
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      roles: ["admin"],
    },
  ];

  const filteredItems = user?.role
    ? sidebarItems.filter((item) => item.roles.includes(user.role as UserRole))
    : [];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-primary/5 transition-all duration-300",
        open ? "w-56" : "w-20"
      )}
    >
      <div className="flex items-center justify-center gap-2 h-16 border-b border-gray-600">
        <div className="size-8 rounded-full">
          <img
            src={"/logo.png"}
            alt="logo"
            className="w-full object-center rounded-md"
          />
        </div>
        {open && (
          <span className="text-2xl font-bold brand-name">Green Farm</span>
        )}
      </div>

      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.name}>
                {open ? (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-4 py-2 rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-primary/50"
                    )}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center px-4 py-3 rounded-md transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-primary/50"
                        )}
                      >
                        <item.icon className="h-5 w-5 mx-auto" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent className="bg-primary/90 text-primary-foreground">
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
