import { NextResponse } from "next/server";
import { createCollection, listCollections } from "@/lib/mono/collections";
import { MonoApiError } from "@/lib/mono/errors";

export async function GET() {
  try {
    const result = await listCollections();
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createCollection(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

function handleError(error: unknown) {
  if (error instanceof MonoApiError) {
    return NextResponse.json(
      { message: error.message, errorCode: error.errorCode },
      { status: error.status },
    );
  }
  return NextResponse.json({ message: "Unexpected error" }, { status: 500 });
}
