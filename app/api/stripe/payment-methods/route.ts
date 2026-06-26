import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.stripeCustomerId) {
    return NextResponse.json({ paymentMethods: [] });
  }

  const methods = await stripe.paymentMethods.list({
    customer: user.stripeCustomerId,
    type: "card",
  });

  return NextResponse.json({ paymentMethods: methods.data });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { paymentMethodId } = await req.json();
  if (!paymentMethodId) {
    return NextResponse.json({ error: "Missing paymentMethodId" }, { status: 400 });
  }

  await stripe.paymentMethods.detach(paymentMethodId);
  return NextResponse.json({ success: true });
}
