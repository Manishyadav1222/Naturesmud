import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export interface InvoiceItemInput {
  name: string;
  sku?: string;
  quantity: number;
  price: number;
}

export interface InvoiceOrderInput {
  orderNumber: string;
  createdAt?: string | Date;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  shippingCity: string;
  shippingZone?: string;
  isValley?: boolean;
  paymentMethod: string;
  paymentStatus?: string;
  paymentReference?: string;
  subtotal: number;
  discount?: number;
  shippingFee?: number;
  total: number;
  items: InvoiceItemInput[];
}

/**
 * Generates an official NaturesMud Tax Invoice PDF as a Buffer using pdfkit
 */
export async function generateInvoicePdfBuffer(order: InvoiceOrderInput): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 40,
        info: {
          Title: `Invoice ${order.orderNumber} - Nature's Mud Nepal`,
          Author: "Nature's Mud Nepal",
          Subject: 'Order Invoice & Bill of Supply',
          Keywords: 'NaturesMud, Invoice, Superfoods, Nepal',
        },
      });

      const buffers: Buffer[] = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      const invoiceNum = `INV-${order.orderNumber.replace(/[^a-zA-Z0-9]/g, '')}`;
      const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
      const formattedDate = orderDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      // Palette
      const primaryColor = '#1A3826'; // Deep Himalayan Green
      const goldColor = '#7A5230'; // Warm Cedar
      const charcoal = '#242220';
      const graySub = '#666666';
      const lightBg = '#F6F3EE';

      // 1. Header Banner
      doc.rect(40, 40, 515, 65).fill(lightBg);

      doc.fillColor(primaryColor).fontSize(20).font('Helvetica-Bold').text("NATURE'S MUD NEPAL", 55, 52);
      doc.fillColor(goldColor).fontSize(9).font('Helvetica').text('100% Pure Himalayan Superfoods & Baby Nutrition', 55, 76);
      doc.fillColor(graySub).fontSize(8).text('Kathmandu Valley, Nepal | www.naturesmud.shop | +977 9713888002', 55, 88);

      // Tax Invoice Title on Top Right
      doc.fillColor(primaryColor).fontSize(14).font('Helvetica-Bold').text('TAX INVOICE', 410, 52, { align: 'right' });
      doc.fillColor(charcoal).fontSize(9).font('Helvetica-Bold').text(invoiceNum, 410, 72, { align: 'right' });
      doc.fillColor(graySub).fontSize(8).font('Helvetica').text(formattedDate, 410, 86, { align: 'right' });

      doc.moveDown(2);

      // 2. Customer & Order Meta Information Box
      const metaY = 120;
      doc.rect(40, metaY, 515, 80).strokeColor('#E0D9CE').lineWidth(1).stroke();

      // Left: Billed / Shipped To
      doc.fillColor(primaryColor).fontSize(9).font('Helvetica-Bold').text('BILLED & DELIVERED TO:', 50, metaY + 10);
      doc.fillColor(charcoal).fontSize(10).font('Helvetica-Bold').text(order.customerName, 50, metaY + 23);
      doc.fillColor(graySub).fontSize(8).font('Helvetica').text(`Phone: ${order.customerPhone}`, 50, metaY + 36);
      if (order.customerEmail) {
        doc.text(`Email: ${order.customerEmail}`, 50, metaY + 47);
      }
      const destText = `${order.shippingAddress}, ${order.shippingCity} (${order.isValley ? 'Inside Valley' : 'Outside Valley'})`;
      doc.text(`Address: ${destText}`, 50, metaY + (order.customerEmail ? 58 : 47), { width: 240 });

      // Right: Order Metadata
      doc.fillColor(primaryColor).fontSize(9).font('Helvetica-Bold').text('ORDER DETAILS:', 330, metaY + 10);
      doc.fillColor(charcoal).fontSize(8).font('Helvetica-Bold').text('Order ID:', 330, metaY + 25);
      doc.font('Helvetica').text(`#${order.orderNumber}`, 420, metaY + 25);

      doc.font('Helvetica-Bold').text('Payment Method:', 330, metaY + 38);
      doc.font('Helvetica').text(String(order.paymentMethod || 'COD').toUpperCase(), 420, metaY + 38);

      doc.font('Helvetica-Bold').text('Payment Status:', 330, metaY + 51);
      const payStatus = order.paymentStatus ? order.paymentStatus.toUpperCase() : 'PENDING';
      doc.fillColor(payStatus === 'PAID' ? '#1A7A38' : '#B45309').text(payStatus, 420, metaY + 51);

      if (order.paymentReference) {
        doc.fillColor(charcoal).font('Helvetica-Bold').text('Ref / Txn ID:', 330, metaY + 64);
        doc.font('Helvetica').text(order.paymentReference, 420, metaY + 64);
      }

      // 3. Items Table Header
      const tableY = 215;
      doc.rect(40, tableY, 515, 22).fill(primaryColor);

      doc.fillColor('#FFFFFF').fontSize(8).font('Helvetica-Bold');
      doc.text('SN', 48, tableY + 6);
      doc.text('ITEM DESCRIPTION', 75, tableY + 6);
      doc.text('QTY', 330, tableY + 6, { width: 40, align: 'center' });
      doc.text('UNIT PRICE', 380, tableY + 6, { width: 75, align: 'right' });
      doc.text('TOTAL (NPR)', 465, tableY + 6, { width: 80, align: 'right' });

      // 4. Table Rows
      let currentY = tableY + 22;
      const rowHeight = 22;

      order.items.forEach((it, idx) => {
        const isEven = idx % 2 === 0;
        if (isEven) {
          doc.rect(40, currentY, 515, rowHeight).fill('#FAF8F5');
        }

        doc.fillColor(charcoal).fontSize(8).font('Helvetica');
        doc.text(String(idx + 1), 48, currentY + 6);
        doc.font('Helvetica-Bold').text(it.name, 75, currentY + 6, { width: 245, lineBreak: false });
        doc.font('Helvetica').text(String(it.quantity), 330, currentY + 6, { width: 40, align: 'center' });
        doc.text(`Rs. ${Number(it.price).toLocaleString()}`, 380, currentY + 6, { width: 75, align: 'right' });
        doc.font('Helvetica-Bold').text(`Rs. ${(it.price * it.quantity).toLocaleString()}`, 465, currentY + 6, { width: 80, align: 'right' });

        currentY += rowHeight;
      });

      // Bottom border for table
      doc.rect(40, currentY, 515, 1).fill('#E0D9CE');
      currentY += 10;

      // 5. Summary Breakdown (Subtotal, Discount, Delivery, Grand Total)
      const sumX = 330;
      const valX = 465;

      doc.fillColor(graySub).fontSize(8).font('Helvetica');
      doc.text('Subtotal:', sumX, currentY);
      doc.fillColor(charcoal).font('Helvetica').text(`Rs. ${Number(order.subtotal || order.total).toLocaleString()}`, valX, currentY, { width: 80, align: 'right' });
      currentY += 14;

      if (order.discount && order.discount > 0) {
        doc.fillColor('#1A7A38').font('Helvetica');
        doc.text('Discount Applied:', sumX, currentY);
        doc.text(`- Rs. ${Number(order.discount).toLocaleString()}`, valX, currentY, { width: 80, align: 'right' });
        currentY += 14;
      }

      const shipping = typeof order.shippingFee !== 'undefined' ? order.shippingFee : 0;
      doc.fillColor(graySub).font('Helvetica');
      doc.text('Delivery & Courier:', sumX, currentY);
      doc.fillColor(charcoal).text(shipping === 0 ? 'FREE' : `Rs. ${shipping.toLocaleString()}`, valX, currentY, { width: 80, align: 'right' });
      currentY += 16;

      // Grand Total Box
      doc.rect(sumX - 10, currentY - 4, 235, 26).fill(lightBg);
      doc.rect(sumX - 10, currentY - 4, 235, 26).strokeColor(primaryColor).lineWidth(1).stroke();

      doc.fillColor(primaryColor).fontSize(10).font('Helvetica-Bold').text('FINAL AMOUNT:', sumX, currentY + 3);
      doc.fontSize(11).font('Helvetica-Bold').text(`Rs. ${Number(order.total).toLocaleString()}`, valX - 10, currentY + 3, { width: 90, align: 'right' });

      // 6. Guarantee & Sign-off Footer
      const footerY = 700;
      doc.rect(40, footerY, 515, 60).fill('#FAF7F2');
      doc.rect(40, footerY, 515, 60).strokeColor('#EAE3D6').lineWidth(1).stroke();

      doc.fillColor(primaryColor).fontSize(8).font('Helvetica-Bold').text('HIMALAYAN PURITY PROMISE & CUSTOMER SUPPORT', 50, footerY + 10);
      doc.fillColor(graySub).fontSize(7.5).font('Helvetica').text(
        'Every NaturesMud product is 100% natural with zero artificial additives, tested for purity. For queries, returns, or support, WhatsApp our care desk at +977 9713888002 or email hello@naturesmud.shop.',
        50,
        footerY + 23,
        { width: 495 }
      );
      doc.fillColor(goldColor).fontSize(7).text('Thank you for choosing authentic Himalayan wholesomeness!', 50, footerY + 45);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Generates and saves the PDF file permanently to public/uploads/invoices
 */
export async function saveInvoicePdfFile(
  order: InvoiceOrderInput
): Promise<{ filePath: string; fileUrl: string; fileName: string; buffer: Buffer }> {
  const buffer = await generateInvoicePdfBuffer(order);
  const fileName = `INV-${order.orderNumber.replace(/[^a-zA-Z0-9]/g, '')}.pdf`;

  const invoicesDir = path.join(process.cwd(), 'public', 'uploads', 'invoices');
  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir, { recursive: true });
  }

  const filePath = path.join(invoicesDir, fileName);
  fs.writeFileSync(filePath, buffer);

  const fileUrl = `/uploads/invoices/${fileName}`;
  return { filePath, fileUrl, fileName, buffer };
}
