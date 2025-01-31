// app/api/auth/tokens/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  return NextResponse.json({ accessToken, refreshToken });
}

export async function POST(request: NextRequest) {
  const { accessToken, refreshToken } = await request.json();
  const response = NextResponse.json({ success: true });

  // Set cookies with appropriate options
  response.cookies.set({
    name: "accessToken",
    value: accessToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  response.cookies.set({
    name: "refreshToken",
    value: refreshToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });

  // Clear cookies
  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");

  return response;
}
