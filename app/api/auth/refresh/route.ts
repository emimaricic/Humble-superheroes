import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;
    const wasRefreshed = cookieStore.get("tokenRefreshed")?.value;
    const accessToken = request.cookies.get("accessToken")?.value;

    // If tokens were just refreshed by middleware, return existing tokens
    if (wasRefreshed === "true" && accessToken && refreshToken) {
      const accessToken = cookieStore.get("accessToken")?.value;
      if (accessToken && refreshToken) {
        return NextResponse.json({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
      }
    }

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token not found" },
        { status: 401 },
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    const newResponse = NextResponse.json(data);

    // Set the new tokens in cookies
    newResponse.cookies.set({
      name: "accessToken",
      value: data.access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    newResponse.cookies.set({
      name: "refreshToken",
      value: data.refresh_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return newResponse;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to refresh token" },
      { status: 401 },
    );
  }
}
