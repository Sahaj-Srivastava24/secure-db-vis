"use client";

import { MoonIcon, SunIcon, UserCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { useAuth } from "./auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { DatabaseIcon } from "lucide-react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-14 max-w-[1200px] items-center px-20">
        <div className="flex items-center space-x-2 transition-opacity hover:opacity-80">
          <DatabaseIcon className="h-6 w-6 animate-pulse" />
          <span className="font-bold">Secure DB</span>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="transition-opacity hover:opacity-80"
          >
            {theme === "light" ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </Button>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2 transition-opacity hover:opacity-80"
                >
                  <UserCircle className="h-5 w-5" />
                  <span>{user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="animate-in fade-in-0 zoom-in-95">
                <DropdownMenuItem 
                  onClick={() => signOut()}
                  className="transition-colors hover:bg-destructive hover:text-destructive-foreground"
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}