import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";

// http://dosimpact-2.iptime.org:13000/api/payments?orderId=xx2pk175o6d&paymentKey=tviva20240519150451xH8N7&amount=5000
export const GET = async (req: NextRequest, params: any) => {
  console.log(">>params", params);

  const searchParams = req.nextUrl.searchParams;
  console.log(">>searchParams", searchParams);

  const orderId = searchParams.get("orderId");
  const paymentKey = searchParams.get("paymentKey");
  const amount = searchParams.get("amount");
  const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY;

  const url = "https://api.tosspayments.com/v1/payments/confirm";
  const basicToken = Buffer.from(`${secretKey}:`, "utf-8").toString("base64");

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

  // TODO: DB 처리

  return redirect(`/payments/complete?orderId=${orderId}`);
  //   res.redirect(`/payments/complete?orderId=${orderId}`);

  // json resposne
  //   return NextResponse.json({
  //     hello: "true",
  //   });
};
