import { NextResponse } from "next/server";
import { createTransfer, listTransfers } from "@/lib/mono/transfers";
import { MonoApiError } from "@/lib/mono/errors";

export async function GET() {
  try {
    const result = await listTransfers();
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { external_id: string; target_id: string };
    const result = await createTransfer(body.external_id, body.target_id);
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
