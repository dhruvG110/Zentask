"use client";

import * as React from "react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

// Icons
import { Sun, Moon, BarChart3, LayoutDashboard, Menu } from "lucide-react";

// shadcn/ui Components
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../components/ui/navigation-menu";
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "../components/ui/sheet";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { setTheme } = useTheme();
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", text: "Dashboard", icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
    { href: "/analytics", text: "Analytics", icon: <BarChart3 className="mr-2 h-4 w-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        
        {/* --- LEFT SIDE: Logo & Desktop Navigation --- */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">ZenTask</span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <Link href={link.href} legacyBehavior passHref>
                    <NavigationMenuLink active={pathname === link.href} className={navigationMenuTriggerStyle()}>
                      {link.icon} {link.text}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* --- Mobile View: Hamburger Menu on the Left --- */}
        <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <Link href="/" className="flex items-center space-x-2 pb-4">
                    <span className="font-bold">ZenTask</span>
                </Link>
                <div className="grid gap-4 py-4">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link href={link.href} className="flex items-center rounded-md p-2 hover:bg-muted">
                        {link.icon} {link.text}
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
        </div>

        {/* --- RIGHT SIDE: Actions Only --- */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle Theme"
            onClick={() => setTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}