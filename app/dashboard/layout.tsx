"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname
import { Bell, CircleUser, Home, Menu, MapPin, Database } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  countUnreadNotifications,
  users,
} from "../services/dataManagement.service";
import React from "react";
import { NotificationModal } from "./components/NotificationModal";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [roleId, setRoleId] = useState<number | null>(null);
  const [isShowNotifModal, setShowNotifModal] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(0);
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: "",
  });

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const supabase = createClientComponentClient();
        const { data: session, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        // Fetch user data and extract RoleId
        const dataUser = await users(session.session?.user.id);
        const userRoleId = dataUser?.data?.RoleId ?? null;

        // Update state with RoleId
        setRoleId(userRoleId);
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    const getCountUnreadNotif = async () => {
      const result = await countUnreadNotifications();
      setUnreadNotifCount(result);
    };

    getCountUnreadNotif();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const supabases = createClientComponentClient();
      const {
        data: { user },
        error,
      } = await supabases.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        return;
      }
      if (user) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("auth_id", user.id)
          .single();

        if (data) {
          setProfile({
            name: data.name,
          });
        }

        if (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createClientComponentClient();
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          {/* Logo and Notifications */}
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 justify-between">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Image
                className="mx-auto"
                src="/company_logo.png"
                alt="Company Logo"
                width={80}
                height={80}
              />
            </Link>
            <Button
              variant="outline"
              size="icon"
              className=" h-8 w-8 relative"
              onClick={() => {
                setShowNotifModal(!isShowNotifModal);
                setUnreadNotifCount(0);
              }}
            >
              {unreadNotifCount > 0 && (
                <div className="absolute top-[-2px] right-[-2px] h-2 w-2 rounded-full bg-red-500" />
              )}
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  pathname === "/dashboard"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/data-management"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  pathname === "/dashboard/data-management"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                <Database className="h-4 w-4" />
                Data
              </Link>
              <Link
                href="/dashboard/maps"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  pathname === "/dashboard/maps"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                <MapPin className="h-4 w-4" />
                Maps
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col h-screen">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    pathname === "/dashboard"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/data-management"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    pathname === "/dashboard/data-management"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <Database className="h-4 w-4" />
                  Data
                </Link>
                <Link
                  href="/dashboard/maps"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    pathname === "/dashboard/maps"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <MapPin className="h-4 w-4" />
                  Maps
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Search Bar */}
          <div className="w-full flex-1"></div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">Profile</Link>
              </DropdownMenuItem>
              {roleId === 1 && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Children with scrolling */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-y-auto">
          {children}
        </main>

        {isShowNotifModal && (
          <NotificationModal
            onClose={() => {
              setShowNotifModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
