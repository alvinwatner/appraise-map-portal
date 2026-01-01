"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname
import { Bell, CircleUser, Home, Menu, MapPin, Database, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[220px_1fr]">
      {/* Sidebar */}
      <div className="hidden border-r bg-slate-200 md:block ">
        <div className="flex h-full max-h-screen flex-col gap-2s">
          {/* Logo and Notifications */}
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-4 justify-between">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Image
                className="mx-auto"
                src="/company_logo.png"
                alt="Company Logo"
                width={60}
                height={60}
              />
            </Link>
            <h3 className="text-sm">Paramita Konsultan</h3>
          </div>

          {/* Navigation Links */}
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
              {/* Overview Section */}
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2 mt-2">
                Overview
              </p>
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 relative ${
                  pathname === "/dashboard"
                    ? "bg-teal-50 text-teal-700 font-medium pl-4"
                    : "text-muted-foreground hover:text-teal-600 hover:bg-teal-50/50"
                }`}
              >
                {pathname === "/dashboard" && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-500 rounded-r-full" />
                )}
                <Home className="h-4 w-4" />
                Dashboard
              </Link>

              {/* Management Section */}
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2 mt-4">
                Management
              </p>
              <Link
                href="/dashboard/data-management"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 relative ${
                  pathname === "/dashboard/data-management"
                    ? "bg-teal-50 text-teal-700 font-medium pl-4"
                    : "text-muted-foreground hover:text-teal-600 hover:bg-teal-50/50"
                }`}
              >
                {pathname === "/dashboard/data-management" && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-500 rounded-r-full" />
                )}
                <Database className="h-4 w-4" />
                Data
              </Link>
              <Link
                href="/dashboard/maps"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 relative ${
                  pathname === "/dashboard/maps"
                    ? "bg-teal-50 text-teal-700 font-medium pl-4"
                    : "text-muted-foreground hover:text-teal-600 hover:bg-teal-50/50"
                }`}
              >
                {pathname === "/dashboard/maps" && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-500 rounded-r-full" />
                )}
                <MapPin className="h-4 w-4" />
                Maps
              </Link>
              <Link
                href="/dashboard/documents"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 relative ${
                  pathname?.startsWith("/dashboard/documents")
                    ? "bg-teal-50 text-teal-700 font-medium pl-4"
                    : "text-muted-foreground hover:text-teal-600 hover:bg-teal-50/50"
                }`}
              >
                {pathname?.startsWith("/dashboard/documents") && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-500 rounded-r-full" />
                )}
                <FileText className="h-4 w-4" />
                Dokumen
                <Badge variant="secondary" className="ml-auto text-xs bg-teal-100 text-teal-700 hover:bg-teal-100">Beta</Badge>
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={handleLogout}
            >
              Log out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col h-screen overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 bg-slate-200">
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
              <nav className="grid gap-1 text-sm font-medium mt-4">
                {/* Overview Section */}
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
                  Overview
                </p>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 relative ${
                    pathname === "/dashboard"
                      ? "bg-teal-50 text-teal-700 font-medium pl-4"
                      : "text-muted-foreground hover:text-teal-600 hover:bg-teal-50/50"
                  }`}
                >
                  {pathname === "/dashboard" && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-500 rounded-r-full" />
                  )}
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>

                {/* Management Section */}
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2 mt-4">
                  Management
                </p>
                <Link
                  href="/dashboard/data-management"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 relative ${
                    pathname === "/dashboard/data-management"
                      ? "bg-teal-50 text-teal-700 font-medium pl-4"
                      : "text-muted-foreground hover:text-teal-600 hover:bg-teal-50/50"
                  }`}
                >
                  {pathname === "/dashboard/data-management" && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-500 rounded-r-full" />
                  )}
                  <Database className="h-4 w-4" />
                  Data
                </Link>
                <Link
                  href="/dashboard/maps"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 relative ${
                    pathname === "/dashboard/maps"
                      ? "bg-teal-50 text-teal-700 font-medium pl-4"
                      : "text-muted-foreground hover:text-teal-600 hover:bg-teal-50/50"
                  }`}
                >
                  {pathname === "/dashboard/maps" && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-500 rounded-r-full" />
                  )}
                  <MapPin className="h-4 w-4" />
                  Maps
                </Link>
                <Link
                  href="/dashboard/documents"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 relative ${
                    pathname?.startsWith("/dashboard/documents")
                      ? "bg-teal-50 text-teal-700 font-medium pl-4"
                      : "text-muted-foreground hover:text-teal-600 hover:bg-teal-50/50"
                  }`}
                >
                  {pathname?.startsWith("/dashboard/documents") && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-500 rounded-r-full" />
                  )}
                  <FileText className="h-4 w-4" />
                  Dokumen
                  <Badge variant="secondary" className="ml-auto text-xs bg-teal-100 text-teal-700 hover:bg-teal-100">Beta</Badge>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Search Bar */}
          <div className="w-full flex-1"></div>

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
        <main className="flex flex-1 flex-col overflow-y-auto">{children}</main>

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
