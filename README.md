# Poc tosspayments  


## install

결제는 2가지 방식으로 붙일 수 있다.  
- 결제 SDK : 기본적인 방법 
- 결제 위젯 : 노코드 툴로 한번 붙이면 어드민 페이지에서 UI관리가 가능하다.!  

```
# 결제 SDK  
yarn add @tosspayments/payment-sdk  

---
# 참고) 결제 위젯 > https://docs.tosspayments.com/guides/payment-widget/overview  
- 노코드 툴로 관리가 가능하다. 하지만 테스트를 위해 사업자 등록증이 필요
yarn add @tosspayments/payment-widget-sdk
```

## API Key 발급
```
NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY=test
TOSS_PAYMENTS_SECRET_KEY=test
```

## 1.결제 버튼  

```js
"use client";
import { loadTossPayments } from "@tosspayments/payment-sdk";

export default function Page() {
  const handleClick = async () => {
    const tossPayments = await loadTossPayments(
      process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY!
    );

    await tossPayments.requestPayment("카드", {
      amount: 1000,
      orderId: Math.random().toString(36).slice(2),
      orderName: "새우깡",
      successUrl: `${window.location.origin}/api/payments`,
      failUrl: `${window.location.origin}/api/payments/fail`,
    });
  };
  return (
    <div>
      <button onClick={handleClick}>맥북 5000원</button>
    </div>
  );
}
```

## 2.결제 성공 callback 처리

```js
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";

// http://localhost:3000/api/payments?orderId=xx2pk175o6d&paymentKey=tviva20240519150451xH8N7&amount=5000
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

```


## 3.결제 성공 Page

```js
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


```

## ref  

[toss payments 개발자 센터](https://developers.tosspayments.com/)  
[toss payments 결제 API 문서](https://docs.tosspayments.com/reference)  
[결제위젯 Next.js 샘플 프로젝트](https://github.com/tosspayments/payment-widget-sample/blob/main/nextjs/README.md)  
[Youtbue - NextJs 결제연동하기 (feat. Toss/토스페이먼츠)](https://www.youtube.com/watch?v=lpfO2mebYQk)  
