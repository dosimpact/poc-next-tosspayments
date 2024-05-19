import React from "react";

interface CompletePageProps {
  searchParams: {
    orderId: string;
  };
}

const CompletePage = async (props: CompletePageProps) => {
  const searchParams = props?.searchParams;
  const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY || "";
  const basicToken = Buffer.from(`${secretKey}:`, `utf-8`).toString("base64");

  const url = `https://api.tosspayments.com/v1/payments/orders/${searchParams.orderId}`;
  const payments = await fetch(url, {
    headers: {
      Authorization: `Basic ${basicToken}`,
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

  const { card } = payments;

  return (
    <div>
      <h1>결제가 완료되었습니다</h1>
      <ul>
        <li>결제 상품 {payments?.orderName}</li>
        <li>주문번호 {payments?.orderId} </li>
        <pre>{JSON.stringify(payments, null, 2)}</pre>
        <pre>{JSON.stringify(card, null, 2)}</pre>
      </ul>
    </div>
  );
};

export default CompletePage;
