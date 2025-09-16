// 'use client';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';

// export default function GoogleCallback() {
//   const router = useRouter();

//   useEffect(() => {
//     const code = new URL(window.location).searchParams.get('code');
//     console.log(code);
//     if (!code) return router.replace('/login');

//     fetch(
//       `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google/login/`,
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include', // receive HttpOnly cookies
//         body: JSON.stringify({ code, provider: 'google' }),
//       }
//     )
//       .then(response => {
//         if (!response.ok) {
//           // If the response is not ok, throw an error with the response
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then(() => {
//         // access_token & refresh_token cookies are now set
//         router.replace('/dashboard');
//       })
//       .catch(error => {
//         // Log the error details
//         console.error('Error:', error.message);

//         // If the error is an instance of Response, log the response details
//         if (error.response) {
//           console.error('Response status:', error.response.status);
//           console.error('Response data:', error.response.data);
//         }

//         // Redirect to login page with error query parameter
//         router.replace('/login?error=google');
//       });
//   }, [router]);

//   return <p>Signing you in…</p>;
// }
