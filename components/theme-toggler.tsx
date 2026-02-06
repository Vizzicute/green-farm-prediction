"use client";

import { useMounted } from "@/hooks/use-mounted";
import { useTheme } from "next-themes";
import React from "react";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

const ThemeToggler = () => {
  const { theme, setTheme } = useTheme();
  const isMounted = useMounted();
  if (!isMounted) return;
  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      variant={"outline"}
      className="flex items-center justify-center size-9 rounded-full bg-foreground/5"
    >
      {theme === "dark" ? (
        <Moon className="size-4" />
      ) : (
        <Sun className="size-4" />
      )}
    </Button>
  );
};

export default ThemeToggler;
