import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!email?.trim() || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await sql`SELECT id FROM users WHERE email = ${normalizedEmail}`;
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "An account with that email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO users (email, password_hash, name)
      VALUES (${normalizedEmail}, ${passwordHash}, ${name?.trim() || null})
    `;

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/auth/signup]", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
