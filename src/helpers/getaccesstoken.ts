"use server"
import { cookies } from 'next/headers';

export default async function getAccessToken() {
  const cookieStore = cookies();
  const token = (await cookieStore).get('access_token')?.value;
  return token
  }
