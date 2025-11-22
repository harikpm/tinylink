import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/links/:code - get single link
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const link = await prisma.link.findUnique({
    where: { code },
  });

  if (!link) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  return NextResponse.json(link);
}

// POST /api/links/:code - register a click (increment count)
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  try {
    const updated = await prisma.link.update({
      where: { code },
      data: {
        totalClicks: { increment: 1 },
        lastClicked: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    if (err.code === "P2025") {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PATCH /api/links/:code - update url and/or code
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code: currentCode } = await params;
  const body = await req.json();
  let { url, code } = body as { url?: string; code?: string };

  if (!url && !code) {
    return NextResponse.json(
      { error: "Nothing to update" },
      { status: 400 }
    );
  }

  const updateData: any = {};

  if (url) {
    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = "https://" + finalUrl;
    }
    try {
      new URL(finalUrl);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }
    updateData.targetUrl = finalUrl;
  }

  if (code && code.trim() !== currentCode) {
    const newCode = code.trim();
    if (!/^[A-Za-z0-9]+$/.test(newCode)) {
      return NextResponse.json(
        { error: "Code must be alphanumeric" },
        { status: 400 }
      );
    }
    updateData.code = newCode;
  }

  try {
    const updated = await prisma.link.update({
      where: { code: currentCode },
      data: updateData,
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Code already exists" },
        { status: 409 }
      );
    }
    if (err.code === "P2025") {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/links/:code - delete
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  if (!code) {
    return NextResponse.json({ error: "Code missing" }, { status: 400 });
  }

  try {
    await prisma.link.delete({
      where: { code },
    });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err.code === "P2025") {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
