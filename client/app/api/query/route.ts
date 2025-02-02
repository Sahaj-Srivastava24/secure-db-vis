import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { executeQuery } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const user = await getSession();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { query } = await request.json();

    if (!query) {
      return new NextResponse("Query is required", { status: 400 });
    }

    const result = await executeQuery(query);
    return NextResponse.json(result);
  } catch (error) {
    return new NextResponse(
      error instanceof Error ? error.message : "An error occurred",
      { status: 500 }
    );
  }
}