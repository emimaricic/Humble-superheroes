// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

// Token refresh cache
const refreshPromises = new Map<
  string,
  Promise<{ access_token: string; refresh_token: string }>
>();

const protectedRoutes = [
  "/superheroes",
];

const authRoutes = [
  "/auth",
  "/auth/signup",
];

const publicRoutes = ["/"];

interface DecodedToken {
  exp: number;
}

async function refreshTokens(
  refreshToken: string,
): Promise<{ access_token: string; refresh_token: string }> {
  // Avoid redundant refresh calls using a cache
  if (!refreshPromises.has(refreshToken)) {
    const refreshPromise = fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      },
    )
      .then((response) => {
        if (!response.ok) throw new Error("Refresh failed");
        return response.json();
      })
      .then((data) => {
        return {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        };
      })
      .finally(() => refreshPromises.delete(refreshToken)); // Clean up cache

    refreshPromises.set(refreshToken, refreshPromise);
  }

  return refreshPromises.get(refreshToken)!;
}

function isTokenExpired(token: string, gracePeriod = 30): boolean {
  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime + gracePeriod;
  } catch {
    return true; // Consider invalid tokens as expired
  }
}

function setTokenCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
): NextResponse {
  const secure = process.env.NODE_ENV === "production";
  const commonOptions = { httpOnly: true, secure, path: "/" };

  response.cookies.set({
    name: "accessToken",
    value: accessToken,
    ...commonOptions,
    sameSite: "lax",
  });

  response.cookies.set({
    name: "refreshToken",
    value: refreshToken,
    ...commonOptions,
    sameSite: "strict",
  });

  return response;
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) => {
    if (route.includes("*")) {
      // Replace '*' with a regex that matches anything
      const pattern = new RegExp(`^${route.replace("*", ".*")}$`);
      return pattern.test(path);
    }
    return route === path; // Exact match for non-wildcard routes
  });
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (req.nextUrl.pathname.includes("callback=oauth")) {
    return NextResponse.next();
  }

  // Handle public routes
  if (isPublicRoute) {
    return NextResponse.redirect(new URL("/superheroes", req.nextUrl));
  }

  // Handle auth routes
  if (isAuthRoute) {
    if (!refreshToken) {
      return NextResponse.next();
    }

    try {
      const tokens = await refreshTokens(refreshToken);
      const response = NextResponse.redirect(
        new URL("/superheroes", req.nextUrl),
      );
      return setTokenCookies(
        response,
        tokens.access_token,
        tokens.refresh_token,
      );
    } catch {
      const response = NextResponse.next();
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }
  }

  // Handle protected routes
  if (isProtectedRoute) {
    if (!accessToken || isTokenExpired(accessToken)) {
      if (!refreshToken) {
        const response = NextResponse.redirect(new URL("/auth", req.nextUrl));
        response.cookies.set({
          name: "redirectedToAuth",
          value: "true",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 30,
          path: "/",
        });
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        return response;
      }

      try {
        const tokens = await refreshTokens(refreshToken);
        const response = NextResponse.next();
        return setTokenCookies(
          response,
          tokens.access_token,
          tokens.refresh_token,
        );
      } catch (error) {
        const response = NextResponse.redirect(new URL("/auth", req.url));
        response.headers.set("x-middleware-cache", "no-cache");
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        response.cookies.delete("redirectedToAuth");
        return response;
      }
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("Authorization", `Bearer ${accessToken}`);
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|icons|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
