import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

const MOCK_SCORES = [
  { id: 1, player_name: "FarmKing", game_id: "chicken-chase", score: 9500, created_at: new Date().toISOString() },
  { id: 2, player_name: "PixelCow", game_id: "chicken-chase", score: 8200, created_at: new Date().toISOString() },
  { id: 3, player_name: "HayBaler", game_id: "chicken-chase", score: 7100, created_at: new Date().toISOString() },
  { id: 4, player_name: "EggHunter", game_id: "chicken-chase", score: 6800, created_at: new Date().toISOString() },
  { id: 5, player_name: "GooseChaser", game_id: "chicken-chase", score: 5500, created_at: new Date().toISOString() },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { player_name, game_id, score } = body;

    if (!player_name || typeof player_name !== "string" || player_name.trim().length === 0) {
      return NextResponse.json({ error: "Player name is required" }, { status: 400 });
    }

    if (!game_id || typeof game_id !== "string") {
      return NextResponse.json({ error: "Game ID is required" }, { status: 400 });
    }

    const numScore = Number(score);
    if (isNaN(numScore) || numScore < 0) {
      return NextResponse.json({ error: "Valid score is required" }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO game_scores (player_name, game_id, score)
       VALUES ($1, $2, $3)
       RETURNING id, player_name, game_id, score, created_at`,
      [player_name.trim(), game_id.trim(), numScore]
    );

    if (!result) {
      return NextResponse.json({
        success: true,
        data: {
          id: Date.now(),
          player_name: player_name.trim(),
          game_id: game_id.trim(),
          score: numScore,
          created_at: new Date().toISOString(),
        },
        mock: true,
      });
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Score submission error:", error);
    return NextResponse.json({ error: "Failed to submit score" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("game_id") || "chicken-chase";
    const limit = Math.min(Number(searchParams.get("limit") || 10), 100);

    const result = await query(
      `SELECT id, player_name, game_id, score, created_at
       FROM game_scores
       WHERE game_id = $1
       ORDER BY score DESC
       LIMIT $2`,
      [gameId, limit]
    );

    if (!result) {
      return NextResponse.json({
        data: MOCK_SCORES.filter((s) => s.game_id === gameId).slice(0, limit),
        mock: true,
      });
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Scores fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch scores" }, { status: 500 });
  }
}
