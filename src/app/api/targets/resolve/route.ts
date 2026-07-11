import { NextResponse } from "next/server";
import { resolveTarget } from "@/lib/mono/transfers";
import { MonoApiError } from "@/lib/mono/errors";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { format: "plain_key"; value: string };
    const result = await resolveTarget(body.format, body.value);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof MonoApiError) {
      return NextResponse.json(
        { message: error.message, errorCode: error.errorCode },
        { status: error.status },
      );
    }
    return NextResponse.json({ message: "Unexpected error" }, { status: 500 });
  }
}
