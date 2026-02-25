import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      attending = true,
      guest_count = 1,
      dietary_restrictions = "",
      potluck_dish = "",
      message = "",
    } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email is required" },
        { status: 400 }
      );
    }

    const guestCount = Number(guest_count);
    if (attending && (isNaN(guestCount) || guestCount < 1)) {
      return NextResponse.json(
        { error: "Guest count must be at least 1" },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO rsvps (name, email, attending, guest_count, dietary_restrictions, potluck_dish, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, email, attending, guest_count, dietary_restrictions, potluck_dish, message, created_at`,
      [
        name.trim(),
        email.trim().toLowerCase(),
        attending,
        attending ? guestCount : 0,
        dietary_restrictions.trim(),
        potluck_dish.trim(),
        message.trim(),
      ]
    );

    if (!result) {
      return NextResponse.json({
        success: true,
        data: {
          id: Date.now(),
          name: name.trim(),
          email: email.trim().toLowerCase(),
          attending,
          guest_count: attending ? guestCount : 0,
          dietary_restrictions: dietary_restrictions.trim(),
          potluck_dish: potluck_dish.trim(),
          message: message.trim(),
          created_at: new Date().toISOString(),
        },
        mock: true,
      });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error("RSVP submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit RSVP. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await query(
      "SELECT * FROM rsvps ORDER BY created_at DESC"
    );

    if (!result) {
      return NextResponse.json({
        data: [],
        mock: true,
      });
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("RSVP fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch RSVPs" },
      { status: 500 }
    );
  }
}
