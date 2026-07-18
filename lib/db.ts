import { neon } from "@neondatabase/serverless";

/**
 * If Atlas already has a db connection helper (e.g. lib/db.ts using Neon
 * or Prisma), use that instead of this file to avoid two separate
 * connection paths to the same database. This is written standalone
 * since I don't have Atlas's existing db setup in this session.
 */
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Add it to .env.local — never commit that file."
  );
}

export const sql = neon(process.env.DATABASE_URL);
