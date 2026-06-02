import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    return NextResponse.json(
      { success: false, message: "API URL belum dikonfigurasi" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    // Forward the request to the backend, including cookies for auth
    const cookie = req.headers.get("cookie") || "";
    const res = await fetch(`${baseUrl}/api/vouchers/buy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal terhubung ke server" },
      { status: 500 }
    );
  }
}
