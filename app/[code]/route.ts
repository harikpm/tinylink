import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: any) {
  const link = await prisma.link.findUnique({ where: { code: params.code } });

  if (!link) return new NextResponse("Not found", { status: 404 });

  await prisma.link.update({
    where: { code: params.code },
    data: {
      totalClicks: { increment: 1 },
      lastClicked: new Date(),
    },
  });

  return NextResponse.redirect(link.targetUrl, 302);
}
