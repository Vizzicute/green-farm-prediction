"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSession } from "@/hooks/use-session";
import { User2 } from "lucide-react";

interface iComProps {
  withName?: boolean;
}

const UserButton = ({ withName = false }: iComProps) => {
  const { data: session, isPending: sessionLoading } = useSession();
  return (
    <div className="flex items-center gap-2">
      <Avatar className="size-8 border-2 border-foreground/70">
        {session?.user.image && !sessionLoading ? (
          <AvatarImage src={session?.user.image} className="object-contain" />
        ) : (
          <AvatarFallback>
            <User2 />
          </AvatarFallback>
        )}
      </Avatar>
      {withName && !sessionLoading && (
        <div className="max-sm:hidden flex flex-col items-start">
          <span className="text-sm font-medium">{session?.user.name}</span>
          <div className="flex items-center gap-1">
            <span className={`w-2 h-2 bg-green-500 rounded-full`} />
            {session && session.user.role && (
              <span className="text-[10px] text-gray-500 capitalize">
                {session.user.role}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserButton;
