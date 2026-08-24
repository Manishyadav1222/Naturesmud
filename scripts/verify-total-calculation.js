const http = require('http');

function postOrder(payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: 8000,
        path: '/api/v1/orders',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
          'Accept': 'application/json',
        },
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch {
            resolve({ status: res.statusCode, data: body });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function verifyCalculations() {
  console.log('🚀 Running Total & Payment Calculation Accuracy Verification...\n');

  // Test Case 1: Inside Valley, Order below Rs. 2000 (Product 1 = Rs. 650, Qty = 2 -> Subtotal Rs. 1300 + Rs. 100 Delivery = Rs. 1400)
  console.log('1️⃣ Test Case 1: Inside Valley under free shipping threshold');
  const res1 = await postOrder({
    items: [{ product_id: 1, quantity: 2 }],
    shipping_name: 'Test Customer 1',
    shipping_phone: '9801234567',
    shipping_address: 'Samakhushi, Kathmandu',
    shipping_city: 'Kathmandu',
    shipping_zone: 'Bagmati',
    payment_method: 'cod',
    is_valley: true,
  });

  const o1 = res1.data?.order;
  console.log(`Order Number: ${o1?.order_number}`);
  console.log(`Subtotal: Rs. ${o1?.subtotal} | Shipping: Rs. ${o1?.shipping_fee} | Discount: Rs. ${o1?.discount} | Total: Rs. ${o1?.total}`);
  const expectedTotal1 = 1300 + 100;
  if (Number(o1?.total) === expectedTotal1) {
    console.log(`✅ Passed: Expected Rs. ${expectedTotal1} === Received Rs. ${o1?.total}\n`);
  } else {
    console.error(`❌ Failed: Expected Rs. ${expectedTotal1} !== Received Rs. ${o1?.total}\n`);
  }

  // Test Case 2: Inside Valley with 10% Welcome Coupon (Subtotal Rs. 1300 - Rs. 130 Discount + Rs. 100 Shipping = Rs. 1270)
  console.log('2️⃣ Test Case 2: Inside Valley with WELCOME10 Coupon (10% off)');
  const res2 = await postOrder({
    items: [{ product_id: 1, quantity: 2 }],
    shipping_name: 'Test Customer 2',
    shipping_phone: '9801234567',
    shipping_address: 'Gongabu, Kathmandu',
    shipping_city: 'Kathmandu',
    shipping_zone: 'Bagmati',
    payment_method: 'cod',
    coupon_code: 'WELCOME10',
    is_valley: true,
  });

  const o2 = res2.data?.order;
  console.log(`Order Number: ${o2?.order_number}`);
  console.log(`Subtotal: Rs. ${o2?.subtotal} | Shipping: Rs. ${o2?.shipping_fee} | Discount: Rs. ${o2?.discount} | Total: Rs. ${o2?.total}`);
  const expectedTotal2 = 1300 - 130 + 100;
  if (Number(o2?.total) === expectedTotal2) {
    console.log(`✅ Passed: Expected Rs. ${expectedTotal2} === Received Rs. ${o2?.total}\n`);
  } else {
    console.error(`❌ Failed: Expected Rs. ${expectedTotal2} !== Received Rs. ${o2?.total}\n`);
  }

  // Test Case 3: Outside Valley FonePay QR Order (Product 2 = Rs. 750, Qty = 2 -> Subtotal Rs. 1500 + Rs. 200 Courier = Rs. 1700)
  console.log('3️⃣ Test Case 3: Outside Valley FonePay QR with Advance Slip');
  const res3 = await postOrder({
    items: [{ product_id: 2, quantity: 2 }],
    shipping_name: 'Pokhara Customer',
    shipping_phone: '9846012345',
    shipping_address: 'Lakeside, Pokhara',
    shipping_city: 'Pokhara',
    shipping_zone: 'Gandaki',
    payment_method: 'fonepay',
    receipt_image: '/images/krisha-fonepay-qr.png',
    payment_reference: 'FONE-778899',
    is_valley: false,
  });

  const o3 = res3.data?.order;
  console.log(`Order Number: ${o3?.order_number}`);
  console.log(`Subtotal: Rs. ${o3?.subtotal} | Shipping: Rs. ${o3?.shipping_fee} | Discount: Rs. ${o3?.discount} | Total: Rs. ${o3?.total}`);
  const expectedTotal3 = 1500 + 200;
  if (Number(o3?.total) === expectedTotal3) {
    console.log(`✅ Passed: Expected Rs. ${expectedTotal3} === Received Rs. ${o3?.total}\n`);
  } else {
    console.error(`❌ Failed: Expected Rs. ${expectedTotal3} !== Received Rs. ${o3?.total}\n`);
  }

  // Test Case 4: Free Shipping (Subtotal >= Rs. 3000 -> Shipping Rs. 0)
  console.log('4️⃣ Test Case 4: High Value Order Qualifying for Free Shipping');
  const res4 = await postOrder({
    items: [{ product_id: 1, quantity: 5 }], // 5 * 650 = 3250
    shipping_name: 'Bulk Customer',
    shipping_phone: '9851012345',
    shipping_address: 'Birtamode, Jhapa',
    shipping_city: 'Jhapa',
    shipping_zone: 'Koshi',
    payment_method: 'fonepay',
    receipt_image: '/images/krisha-fonepay-qr.png',
    is_valley: false,
  });

  const o4 = res4.data?.order;
  console.log(`Order Number: ${o4?.order_number}`);
  console.log(`Subtotal: Rs. ${o4?.subtotal} | Shipping: Rs. ${o4?.shipping_fee} | Discount: Rs. ${o4?.discount} | Total: Rs. ${o4?.total}`);
  const expectedTotal4 = 3250;
  if (Number(o4?.total) === expectedTotal4 && Number(o4?.shipping_fee) === 0) {
    console.log(`✅ Passed: Free Shipping Applied! Expected Rs. ${expectedTotal4} === Received Rs. ${o4?.total}\n`);
  } else {
    console.error(`❌ Failed: Expected Rs. ${expectedTotal4} !== Received Rs. ${o4?.total}\n`);
  }
}

verifyCalculations().catch(console.error);
