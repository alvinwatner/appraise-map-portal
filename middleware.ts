import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|login|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export async function middleware(req: NextRequest) {
  const { pathname, origin } = new URL(req.url);

  // Exclude the login page from the middleware to avoid redirection loops
  if (pathname === "/login") {
    return NextResponse.next();
  }

  const res = NextResponse.next();

  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components
  const { data: session, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Error fetching session:", error.message);
    return res;
  }

  // Check if user is trying to access restricted dashboard routes
  if (
    [
      "/dashboard",
      "/dashboard/data-management",
      "/dashboard/maps",
      "/profile",
      "/dashboard/settings",
    ].includes(pathname)
  ) {
    // If session exists but user tries to access restricted routes
    if (!session.session) {
      return NextResponse.redirect(`${origin}/login`, { status: 303 });
    }
  }

  return res;
}
