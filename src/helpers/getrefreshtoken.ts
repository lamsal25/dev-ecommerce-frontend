"use server"
import { cookies } from 'next/headers';

export default async function getRefreshToken() {
  const cookieStore = cookies();
  const token = (await cookieStore).get('refresh_token')?.value;
  return token
  }
