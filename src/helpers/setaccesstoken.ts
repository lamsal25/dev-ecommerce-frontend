"use server";
import { cookies } from "next/headers";

export async function setAccessTokenCookie(token: string) {
  (await cookies()).set("access_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax", // necessary for cross-site if your frontend/backend differ
    maxAge:  60 * 60, // in seconds (72 hours)
    path: "/",
  });
  return true;
}