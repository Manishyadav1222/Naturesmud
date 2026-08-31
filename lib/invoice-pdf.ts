import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
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
 * Generates an official NaturesMud Tax Invoice PDF as a Buffer using pdf-lib (100% Next.js compatible)
 */
export async function generateInvoicePdfBuffer(order: InvoiceOrderInput): Promise<Buffer> {
  const doc = await PDFDocument.create();
  doc.setTitle(`Invoice ${order.orderNumber} - Nature's Mud Nepal`);
  doc.setAuthor("Nature's Mud Nepal");
  doc.setSubject('Official Tax Invoice & Bill of Supply');

  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);

  // A4 dimensions: 595.28 x 841.89 points
  const page = doc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();

  // Colors
  const primaryGreen = rgb(0.176, 0.353, 0.153); // #2D5A27
  const darkForest = rgb(0.102, 0.220, 0.149);   // #1A3826
  const goldAccent = rgb(0.855, 0.647, 0.125);   // #DAA520
  const lightBg = rgb(0.980, 0.969, 0.949);      // #FAF7F2
  const textDark = rgb(0.12, 0.12, 0.12);
  const textMuted = rgb(0.45, 0.45, 0.45);
  const tableBorder = rgb(0.88, 0.88, 0.88);

  const margin = 40;
  const contentWidth = width - margin * 2;

  // 1. Top Decorative Bar
  page.drawRectangle({
    x: 0,
    y: height - 8,
    width: width,
    height: 8,
    color: primaryGreen,
  });

  // 2. Header: Logo & Company Information
  page.drawText("NATURE'S MUD NEPAL", {
    x: margin,
    y: height - 48,
    size: 20,
    font: helveticaBold,
    color: darkForest,
  });

  page.drawText('100% Pure Himalayan Superfoods & Baby Nutrition', {
    x: margin,
    y: height - 63,
    size: 9,
    font: helvetica,
    color: primaryGreen,
  });

  page.drawText('Krisha Agri Line Pvt. Ltd. | Kalanki, Kathmandu, Nepal', {
    x: margin,
    y: height - 76,
    size: 8,
    font: helvetica,
    color: textMuted,
  });

  page.drawText('PAN / Reg No: 610294857 | WhatsApp: +977 9713888002 | Email: contact@naturesmud.shop', {
    x: margin,
    y: height - 88,
    size: 8,
    font: helvetica,
    color: textMuted,
  });

  // Right Header: TAX INVOICE Tag
  const invoiceTitle = 'TAX INVOICE';
  const invTitleWidth = helveticaBold.widthOfTextAtSize(invoiceTitle, 16);
  page.drawText(invoiceTitle, {
    x: width - margin - invTitleWidth,
    y: height - 48,
    size: 16,
    font: helveticaBold,
    color: primaryGreen,
  });

  const invoiceNum = `INV-${order.orderNumber.replace(/[^a-zA-Z0-9]/g, '')}`;
  const invNumWidth = helveticaBold.widthOfTextAtSize(invoiceNum, 10);
  page.drawText(invoiceNum, {
    x: width - margin - invNumWidth,
    y: height - 63,
    size: 10,
    font: helveticaBold,
    color: textDark,
  });

  const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
  const dateStr = `Date: ${orderDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`;
  const dateWidth = helvetica.widthOfTextAtSize(dateStr, 8);
  page.drawText(dateStr, {
    x: width - margin - dateWidth,
    y: height - 76,
    size: 8,
    font: helvetica,
    color: textMuted,
  });

  // Divider line
  page.drawLine({
    start: { x: margin, y: height - 100 },
    end: { x: width - margin, y: height - 100 },
    thickness: 1,
    color: tableBorder,
  });

  // 3. Billing & Order Meta Section (2 Columns)
  const metaY = height - 118;
  const colWidth = (contentWidth - 20) / 2;

  // Left Box: Billed To
  page.drawRectangle({
    x: margin,
    y: metaY - 78,
    width: colWidth,
    height: 78,
    color: lightBg,
    borderColor: tableBorder,
    borderWidth: 0.5,
  });

  page.drawText('BILLED TO / CUSTOMER', {
    x: margin + 12,
    y: metaY - 16,
    size: 8,
    font: helveticaBold,
    color: primaryGreen,
  });

  page.drawText(order.customerName || 'Valued Customer', {
    x: margin + 12,
    y: metaY - 30,
    size: 10,
    font: helveticaBold,
    color: textDark,
  });

  page.drawText(`Phone: ${order.customerPhone || 'N/A'}`, {
    x: margin + 12,
    y: metaY - 44,
    size: 8,
    font: helvetica,
    color: textDark,
  });

  const fullAddr = [order.shippingAddress, order.shippingCity].filter(Boolean).join(', ') || 'Kathmandu Valley';
  const cleanAddr = fullAddr.length > 40 ? fullAddr.substring(0, 38) + '...' : fullAddr;
  page.drawText(`Address: ${cleanAddr}`, {
    x: margin + 12,
    y: metaY - 56,
    size: 8,
    font: helvetica,
    color: textDark,
  });

  page.drawText(order.isValley ? 'Region: Kathmandu Valley (1-2 Days)' : 'Region: Outside Valley Courier', {
    x: margin + 12,
    y: metaY - 68,
    size: 7.5,
    font: helvetica,
    color: textMuted,
  });

  // Right Box: Order & Payment Details
  page.drawRectangle({
    x: margin + colWidth + 20,
    y: metaY - 78,
    width: colWidth,
    height: 78,
    color: lightBg,
    borderColor: tableBorder,
    borderWidth: 0.5,
  });

  page.drawText('ORDER & PAYMENT DETAILS', {
    x: margin + colWidth + 32,
    y: metaY - 16,
    size: 8,
    font: helveticaBold,
    color: primaryGreen,
  });

  page.drawText(`Order Reference: #${order.orderNumber}`, {
    x: margin + colWidth + 32,
    y: metaY - 30,
    size: 9,
    font: helveticaBold,
    color: textDark,
  });

  page.drawText(`Payment Method: ${String(order.paymentMethod || 'COD').toUpperCase()}`, {
    x: margin + colWidth + 32,
    y: metaY - 44,
    size: 8,
    font: helvetica,
    color: textDark,
  });

  page.drawText(`Payment Status: ${String(order.paymentStatus || 'PENDING').toUpperCase()}`, {
    x: margin + colWidth + 32,
    y: metaY - 56,
    size: 8,
    font: helveticaBold,
    color: order.paymentStatus === 'PAID' ? primaryGreen : goldAccent,
  });

  if (order.paymentReference) {
    page.drawText(`Ref / Transaction ID: ${order.paymentReference}`, {
      x: margin + colWidth + 32,
      y: metaY - 68,
      size: 7.5,
      font: helvetica,
      color: textMuted,
    });
  }

  // 4. Line Items Table
  const tableTopY = metaY - 100;
  const tableHeaderHeight = 22;
  const rowHeight = 20;

  // Table Header Background
  page.drawRectangle({
    x: margin,
    y: tableTopY - tableHeaderHeight,
    width: contentWidth,
    height: tableHeaderHeight,
    color: primaryGreen,
  });

  // Table Header Text
  page.drawText('#', { x: margin + 8, y: tableTopY - 15, size: 8, font: helveticaBold, color: rgb(1, 1, 1) });
  page.drawText('ITEM DESCRIPTION', { x: margin + 30, y: tableTopY - 15, size: 8, font: helveticaBold, color: rgb(1, 1, 1) });
  page.drawText('QTY', { x: margin + 330, y: tableTopY - 15, size: 8, font: helveticaBold, color: rgb(1, 1, 1) });
  page.drawText('RATE (NPR)', { x: margin + 380, y: tableTopY - 15, size: 8, font: helveticaBold, color: rgb(1, 1, 1) });
  page.drawText('AMOUNT (NPR)', { x: margin + 440, y: tableTopY - 15, size: 8, font: helveticaBold, color: rgb(1, 1, 1) });

  let currentY = tableTopY - tableHeaderHeight;
  const items = Array.isArray(order.items) && order.items.length > 0
    ? order.items
    : [{ name: 'Himalayan Superfood Harvest', quantity: 1, price: order.total }];

  items.forEach((item, idx) => {
    currentY -= rowHeight;
    const isEven = idx % 2 === 0;

    // Row zebra background
    if (isEven) {
      page.drawRectangle({
        x: margin,
        y: currentY,
        width: contentWidth,
        height: rowHeight,
        color: lightBg,
      });
    }

    // Row border
    page.drawLine({
      start: { x: margin, y: currentY },
      end: { x: width - margin, y: currentY },
      thickness: 0.5,
      color: tableBorder,
    });

    const itemTotal = Number(item.price || 0) * Number(item.quantity || 1);
    const itemName = item.name.length > 45 ? item.name.substring(0, 43) + '...' : item.name;

    page.drawText(String(idx + 1), { x: margin + 8, y: currentY + 6, size: 8, font: helvetica, color: textDark });
    page.drawText(itemName, { x: margin + 30, y: currentY + 6, size: 8, font: helveticaBold, color: textDark });
    page.drawText(String(item.quantity || 1), { x: margin + 338, y: currentY + 6, size: 8, font: helvetica, color: textDark });
    page.drawText(`Rs. ${Number(item.price || 0).toLocaleString()}`, { x: margin + 380, y: currentY + 6, size: 8, font: helvetica, color: textDark });
    page.drawText(`Rs. ${itemTotal.toLocaleString()}`, { x: margin + 440, y: currentY + 6, size: 8, font: helveticaBold, color: textDark });
  });

  // 5. Summary / Totals Box (Right Aligned)
  const summaryTopY = currentY - 20;
  const summaryWidth = 220;
  const summaryX = width - margin - summaryWidth;

  page.drawRectangle({
    x: summaryX,
    y: summaryTopY - 80,
    width: summaryWidth,
    height: 80,
    color: lightBg,
    borderColor: tableBorder,
    borderWidth: 0.5,
  });

  // Subtotal
  page.drawText('Subtotal:', { x: summaryX + 12, y: summaryTopY - 18, size: 8.5, font: helvetica, color: textMuted });
  page.drawText(`Rs. ${Number(order.subtotal || order.total).toLocaleString()}`, {
    x: summaryX + summaryWidth - 80,
    y: summaryTopY - 18,
    size: 8.5,
    font: helveticaBold,
    color: textDark,
  });

  // Delivery
  page.drawText('Delivery Charge:', { x: summaryX + 12, y: summaryTopY - 32, size: 8.5, font: helvetica, color: textMuted });
  page.drawText(!order.shippingFee || order.shippingFee === 0 ? 'FREE' : `Rs. ${Number(order.shippingFee).toLocaleString()}`, {
    x: summaryX + summaryWidth - 80,
    y: summaryTopY - 32,
    size: 8.5,
    font: helveticaBold,
    color: textDark,
  });

  // Discount
  if (order.discount && order.discount > 0) {
    page.drawText('Discount:', { x: summaryX + 12, y: summaryTopY - 46, size: 8.5, font: helvetica, color: primaryGreen });
    page.drawText(`- Rs. ${Number(order.discount).toLocaleString()}`, {
      x: summaryX + summaryWidth - 80,
      y: summaryTopY - 46,
      size: 8.5,
      font: helveticaBold,
      color: primaryGreen,
    });
  }

  // Grand Total Line
  page.drawRectangle({
    x: summaryX,
    y: summaryTopY - 78,
    width: summaryWidth,
    height: 24,
    color: primaryGreen,
  });

  page.drawText('GRAND TOTAL:', { x: summaryX + 12, y: summaryTopY - 68, size: 9, font: helveticaBold, color: rgb(1, 1, 1) });
  page.drawText(`Rs. ${Number(order.total).toLocaleString()}`, {
    x: summaryX + summaryWidth - 80,
    y: summaryTopY - 68,
    size: 10,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });

  // 6. Himalayan Purity Stamp & Footer
  page.drawRectangle({
    x: margin,
    y: 50,
    width: contentWidth,
    height: 48,
    color: lightBg,
    borderColor: tableBorder,
    borderWidth: 0.5,
  });

  page.drawText('100% PURE HIMALAYAN ORIGIN GUARANTEE', {
    x: margin + 14,
    y: 82,
    size: 8.5,
    font: helveticaBold,
    color: primaryGreen,
  });

  page.drawText('Thank you for supporting regenerative Himalayan farmers & rural cooperatives across Nepal.', {
    x: margin + 14,
    y: 70,
    size: 7.5,
    font: helvetica,
    color: textDark,
  });

  page.drawText('For assistance, inquiries, or return requests: contact@naturesmud.shop | WhatsApp: +977 9713888002', {
    x: margin + 14,
    y: 58,
    size: 7,
    font: helvetica,
    color: textMuted,
  });

  // Bottom green bar
  page.drawRectangle({
    x: 0,
    y: 0,
    width: width,
    height: 8,
    color: primaryGreen,
  });

  const pdfBytes = await doc.save();
  return Buffer.from(pdfBytes);
}

/**
 * Generates and saves the PDF Invoice to disk under /public/uploads/invoices/
 */
export async function saveInvoicePdfFile(order: InvoiceOrderInput): Promise<{ filePath: string; fileUrl: string; buffer: Buffer }> {
  const buffer = await generateInvoicePdfBuffer(order);
  const invoiceDir = path.join(process.cwd(), 'public', 'uploads', 'invoices');

  if (!fs.existsSync(invoiceDir)) {
    fs.mkdirSync(invoiceDir, { recursive: true });
  }

  const cleanOrderNum = order.orderNumber.replace(/[^a-zA-Z0-9]/g, '');
  const fileName = `INV-${cleanOrderNum}.pdf`;
  const filePath = path.join(invoiceDir, fileName);

  fs.writeFileSync(filePath, buffer);

  return {
    filePath,
    fileUrl: `/uploads/invoices/${fileName}`,
    buffer,
  };
}
