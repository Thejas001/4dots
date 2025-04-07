import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes
const protectedRoutes = ["/your-cart", "/your-order"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value; // Get auth token from cookies
  const isProtectedRoute = protectedRoutes.includes(req.nextUrl.pathname);

  // Redirect unauthenticated users trying to access protected routes
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to all routes under `/dashboard` and `/profile`
export const config = {
  matcher: [ "/Cart", "/Order"],
};
