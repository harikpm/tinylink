import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { url, code } = await req.json();

  if (!url) {
    return NextResponse.json({ error: "URL required" }, { status: 400 });
  }

  let finalUrl = url.trim();
  if (!/^https?:\/\//i.test(finalUrl)) {
    finalUrl = "https://" + finalUrl;
  }

  try {
    new URL(finalUrl);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  let finalCode = code?.trim() || Math.random().toString(36).substring(2, 8);

  if (!/^[A-Za-z0-9]+$/.test(finalCode)) {
    return NextResponse.json(
      { error: "Code must be alphanumeric" },
      { status: 400 }
    );
  }

  try {
    const link = await prisma.link.create({
      data: { code: finalCode, targetUrl: finalUrl },
    });
    return NextResponse.json(link, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Code already exists" },
      { status: 409 }
    );
  }
}

export async function GET() {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(links);
}
