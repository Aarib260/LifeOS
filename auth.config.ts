import type { NextAuthConfig } from "next-auth";

/**
 * Split into a separate edge-safe config (this file) and the full config
 * with the Credentials provider's authorize logic (auth.ts) — this is
 * Auth.js v5's recommended pattern for Credentials + middleware, since
 * middleware runs on the Edge runtime and can't use Node-only packages
 * like bcryptjs or the Postgres driver. Middleware imports only from here.
 */
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isOnOS = request.nextUrl.pathname.startsWith("/os");
      if (isOnOS) return isLoggedIn;
      return true;
    },
  },
  providers: [], // populated in auth.ts, which extends this config
};