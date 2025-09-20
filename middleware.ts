// middleware.ts
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Add all public routes here
  publicRoutes: [
    '/', // Your homepage
    '/auth/sign-in(.*)',
    '/auth/sign-up(.*)',
  ],
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};

// You no longer need the 'runtime' export with Clerk v5 middleware.
// It is optimized to run on the Edge runtime by default.