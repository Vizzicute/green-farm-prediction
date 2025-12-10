"use client";

import LogoutButton from "@/components/logout-button";
import ThemeToggler from "@/components/theme-toggler";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserButton from "@/components/user-button";
import { navbarLinks } from "@/data";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSession } from "@/hooks/use-session";
import { ArrowRight, User2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Navbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full">
              <img
                src={"/logo.png"}
                alt="logo"
                className="w-full object-center rounded-md"
              />
            </div>
            <span className="text-2xl font-bold brand-name">
              Green Farm <span className="max-sm:hidden">Predictions</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            {navbarLinks.map((nav, index) => (
              <Link
                key={index}
                href={nav.link}
                className={`${
                  pathname === nav.link
                    ? "underline text-primary"
                    : "text-muted-foreground"
                } hover:text-primary transition-colors`}
              >
                {nav.text}
              </Link>
            ))}
          </nav>

          <div className="flex min-sm:gap-2">
            <ThemeToggler />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative flex items-center space-x-2"
                >
                  <UserButton withName={isMobile ? false : true} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link
                    href={"/admin/profile"}
                    className="flex flex-nowrap items-center"
                  >
                    <User2 className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {session ? (
                    <LogoutButton variant={"ghost"} className="p-0" />
                  ) : (
                    <Link
                      href={"/login"}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      Sign In <ArrowRight />
                    </Link>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
