"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, User, User2 } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Sidebar from "./Sidebar";
import LogoutButton from "@/components/logout-button";
import { useSession } from "@/hooks/use-session";
import ThemeToggler from "@/components/theme-toggler";
import NotificationsDropdown from "./notification";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, isPending } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const togglesidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <>
      <Sidebar open={sidebarOpen} />
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-56" : "ml-20"
        }`}
      >
        <header className="shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-3 border-b">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglesidebar}
                className="mr-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold brand-name">
                Administrator
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <NotificationsDropdown variant={"ghost"} />

              <ThemeToggler />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative flex items-center space-x-2"
                  >
                    <Avatar className="h-8 w-8">
                      {session?.user?.image ? (
                        <AvatarImage
                          src={session?.user?.image}
                          className="object-contain"
                        />
                      ) : (
                        <AvatarFallback>
                          <User2 />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">
                        {session?.user?.name}
                      </span>
                      <div className="flex items-center">
                        <span
                          className={`w-2 h-2 bg-green-500 rounded-full mr-1`}
                        />
                        <span className="text-xs text-gray-500 capitalize">
                          admin
                        </span>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link
                      href={"/dashboard"}
                      target="_blank"
                      className="flex flex-nowrap items-center"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Visit Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogoutButton variant={"ghost"} />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </>
  );
};

export default DashboardLayout;
