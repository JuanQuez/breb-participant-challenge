import { NextResponse } from "next/server";
import { getTransfer } from "@/lib/mono/transfers";
import { MonoApiError } from "@/lib/mono/errors";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const transfer = await getTransfer(id);
    return NextResponse.json(transfer);
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
