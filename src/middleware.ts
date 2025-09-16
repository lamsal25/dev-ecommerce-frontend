import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_RESTRICTED_ROUTES = ['/login', '/register'];
const PROTECTED_ROUTES = [
  '/clientdashboard',
  '/superadmindashboard',
  '/vendorDashboard'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get('refresh_token')?.value;
  const accessToken = request.cookies.get('access_token')?.value;
  console.log("Middleware triggered for path:", pathname);

  // Helper function to refresh token
  const refreshTokens = async () => {
    try {
      console.log("Attempting token refresh...");
      console.log("Refresh Token is", refreshToken);
      
      const refreshController = new AbortController();
      const refreshTimeoutId = setTimeout(() => refreshController.abort(), 5000);
      
      const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/token/refresh/`, {
        method: 'POST',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
          'Cookie': `refresh_token=${refreshToken}`
        },
        body: JSON.stringify({ refresh: refreshToken }),
        signal: refreshController.signal,
      });
      
      clearTimeout(refreshTimeoutId);
      
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        console.log("Tokens refreshed successfully", refreshData);
        return {
          accessToken: refreshData.access,
          refreshToken: refreshData.refresh // New refresh token if rotation enabled
        };
      } else {
        const errorData = await refreshResponse.json();
        console.log("Refresh token invalid:", errorData);
        return null;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      return null;
    }
  };

  // Create response object early so we can modify cookies
  let response = NextResponse.next();

  // If we have a refresh token, ensure we have valid tokens
  if (refreshToken) {
    console.log("Refresh token found, checking access token...");
    let currentAccessToken = accessToken;
    let currentRefreshToken = refreshToken;
    let tokensWereRefreshed = false;

    // Refresh tokens if access token is missing or we'll validate it
    if (!currentAccessToken) {
      const newTokens = await refreshTokens();
      if (newTokens) {
        currentAccessToken = newTokens.accessToken;
        currentRefreshToken = newTokens.refreshToken || currentRefreshToken;
        tokensWereRefreshed = true;
        
        // Set new access token
        response.cookies.set('access_token', currentAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 15, // 15 minutes
          path: '/',
        });

        // Set new refresh token if rotation is enabled
        if (newTokens.refreshToken) {
          response.cookies.set('refresh_token', currentRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
          });
        }
      }
    }

    // Validate token if we have one (for all routes)
    if (currentAccessToken) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getuser/`, {
          headers: { 'Authorization': `Bearer ${currentAccessToken}` },
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);

        // If token is invalid and we haven't already tried refreshing
        if (!userResponse.ok && !tokensWereRefreshed) {
          const newTokens = await refreshTokens();
          if (newTokens) {
            // Update cookies with new tokens
            response.cookies.set('access_token', newTokens.accessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 60 * 15,
              path: '/',
            });

            if (newTokens.refreshToken) {
              response.cookies.set('refresh_token', newTokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7,
                path: '/',
              });
            }
            
            // Retry user request with new token
            const retryResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getuser/`, {
              headers: { 'Authorization': `Bearer ${newTokens.accessToken}` },
            });
            
            if (retryResponse.ok) {
              const redirectResponse = await handleRoleRedirect(request, await retryResponse.json());
              if (redirectResponse) return redirectResponse; // Return the redirect if needed
            }
          }
        } else if (userResponse.ok) {
          const redirectResponse = await handleRoleRedirect(request, await userResponse.json());
          if (redirectResponse) return redirectResponse; // Return the redirect if needed
        }
      } catch (error) {
        console.error("Token validation failed:", error);
      }
    }
  }

  // If no refresh token, redirect protected routes to login
  if (!refreshToken && PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

// Handle role-based redirects - NOW RETURNS the redirect response
async function handleRoleRedirect(request: NextRequest, userData: any): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl;
  const role = userData.role;
  
  if (AUTH_RESTRICTED_ROUTES.includes(pathname)) {
    const redirectUrl = role === 'user' ? '/clientdashboard' :
                       role === 'superadmin' ? '/superadmindashboard' :
                       role === 'vendor' ? '/vendorDashboard' : '/';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    const shouldRedirect = 
      (role === 'user' && !pathname.startsWith('/clientdashboard')) ||
      (role === 'superadmin' && !pathname.startsWith('/superadmindashboard')) ||
      (role === 'vendor' && !pathname.startsWith('/vendorDashboard'));
    
    if (shouldRedirect) {
      const redirectUrl = role === 'user' ? '/clientdashboard' :
                         role === 'superadmin' ? '/superadmindashboard' :
                         '/vendorDashboard';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  return null; // No redirect needed
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};