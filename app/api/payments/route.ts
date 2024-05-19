import { NextRequest } from "next/server";
import { redirect } from "next/navigation";

// http://localhost:3000/api/payments?orderId=xx2pk175o6d&paymentKey=tviva20240519150451xH8N7&amount=5000
export const GET = async (req: NextRequest, params: any) => {
  const searchParams = req.nextUrl.searchParams;

  const orderId = searchParams.get("orderId");
  const paymentKey = searchParams.get("paymentKey");
  const amount = searchParams.get("amount");
  const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY;

  const url = "https://api.tosspayments.com/v1/payments/confirm";
  const basicToken = Buffer.from(`${secretKey}:`, "utf-8").toString("base64");

  // TODO: DB Sync 처리

  await fetch(url, {
    method: "post",
    body: JSON.stringify({
      amount,
      orderId,
      paymentKey,
    }),
    headers: {
      Authorization: `Basic ${basicToken}`,
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

  return redirect(`/payments/complete?orderId=${orderId}`);
};
