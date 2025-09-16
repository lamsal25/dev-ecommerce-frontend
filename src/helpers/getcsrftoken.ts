"use server"
import { cookies } from 'next/headers';

export default async function getCsrfToken() {
  const cookieStore = cookies();
  const token = (await cookieStore).get('csrftoken')?.value;
  return token
  }
