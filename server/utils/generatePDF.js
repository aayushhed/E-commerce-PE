const PDFDocument = require("pdfkit");
const path = require("path");

// ----------------------------------------------------------------
// Layout constants — change these in one place instead of hunting
// through magic numbers scattered across the file.
// ----------------------------------------------------------------
const PAGE_MARGIN = 40;
const PAGE_WIDTH = 595.28; // A4 width in points
const CONTENT_LEFT = PAGE_MARGIN;
const CONTENT_RIGHT = PAGE_WIDTH - PAGE_MARGIN; // 555.28
const CONTENT_WIDTH = CONTENT_RIGHT - CONTENT_LEFT;

const COLORS = {
  brand: "#b91c1c",
  heading: "#1f2937",
  text: "#374151",
  muted: "#6b7280",
  border: "#d1d5db",
  rowDivider: "#f3f4f6",
  tableHeaderBg: "#f3f4f6",
  white: "#ffffff",
};

const FONT = {
  body: "Helvetica",
  bold: "Helvetica-Bold",
};

// Table column layout (x positions + widths), defined once and reused
// for both the header row and every line item row.
const COLUMNS = {
  product: { x: 60, width: 200 },
  qty: { x: 270, width: 60, align: "center" },
  rate: { x: 350, width: 80, align: "right" },
  amount: { x: 450, width: 90, align: "right" },
};

const ROW_HEIGHT = 30;

/**
 * Formats a number as an Indian Rupee amount, e.g. 12345 -> "₹12,345"
 */
const formatINR = (value) => `\u20B9${Number(value || 0).toLocaleString("en-IN")}`;

/**
 * Builds a short, human-readable invoice number from the Mongo ObjectId.
 */
const buildInvoiceNumber = (orderId) =>
  `PE-${orderId.toString().slice(-6).toUpperCase()}`;

/**
 * Draws the company logo, name, and contact block, plus the
 * invoice number / date on the right-hand side.
 */
function drawHeader(doc, { invoiceNo, date }) {
  const logoPath = path.join(__dirname, "../assets/coca-cola-logo.png");

  try {
    doc.image(logoPath, CONTENT_LEFT, 25, { width: 120 });
  } catch (err) {
    console.warn("generateOrderPDF: logo not found, skipping image.", err.message);
  }

  doc
    .fillColor(COLORS.brand)
    .font(FONT.bold)
    .fontSize(24)
    .text("PRAKASH ENTERPRISES", 170, 35);

  doc
    .fillColor(COLORS.text)
    .font(FONT.body)
    .fontSize(11)
    .text("Prop. Brajesh Prasad", 170, 68)
    .text("Authorized Coca-Cola Distributor", 170, 85)
    .text("Kohara Bazar, Bareza Road, Saran", 170, 102)
    .text("Phone: +91 9631032305", 170, 119);

  doc
    .font(FONT.body)
    .fontSize(11)
    .fillColor(COLORS.text)
    .text(`Invoice No: ${invoiceNo}`, 360, 80)
    .text(`Date: ${date}`, 360, 100);

  doc
    .moveTo(CONTENT_LEFT, 155)
    .lineTo(CONTENT_RIGHT, 155)
    .strokeColor(COLORS.border)
    .stroke();
}

/**
 * Draws the two side-by-side info boxes: customer details and order details.
 */
function drawInfoBoxes(doc, order, { invoiceNo, date }) {
  const boxTop = 175;
  const boxHeight = 90;
  const boxWidth = 250;
  const gap = CONTENT_WIDTH - boxWidth * 2; // space between the two boxes

  const customerBoxX = CONTENT_LEFT;
  const orderBoxX = CONTENT_LEFT + boxWidth + gap;

  // Customer details box
  doc.rect(customerBoxX, boxTop, boxWidth, boxHeight).stroke(COLORS.border);

  doc
    .font(FONT.bold)
    .fontSize(11)
    .fillColor(COLORS.heading)
    .text("CUSTOMER DETAILS", customerBoxX + 10, boxTop - 5);

  doc
    .font(FONT.body)
    .fontSize(10)
    .fillColor(COLORS.text)
    .text(`Name: ${order.customerName || "Customer"}`, customerBoxX + 10, boxTop + 20)
    .text(`Phone: ${order.customerPhone || "-"}`, customerBoxX + 10, boxTop + 40);

  // Order details box
  doc.rect(orderBoxX, boxTop, boxWidth, boxHeight).stroke(COLORS.border);

  doc
    .font(FONT.bold)
    .fontSize(11)
    .fillColor(COLORS.heading)
    .text("ORDER DETAILS", orderBoxX + 10, boxTop - 5);

  doc
    .font(FONT.body)
    .fontSize(10)
    .fillColor(COLORS.text)
    .text(`Invoice: ${invoiceNo}`, orderBoxX + 10, boxTop + 20)
    .text(`Date: ${date}`, orderBoxX + 10, boxTop + 40)
    .text(`Status: ${order.status}`, orderBoxX + 10, boxTop + 60);
}

/**
 * Draws the table header row (Product / Qty / Rate / Amount).
 */
function drawTableHeader(doc, tableTop) {
  doc.fillColor(COLORS.tableHeaderBg).rect(CONTENT_LEFT, tableTop, CONTENT_WIDTH, 35).fill();

  doc.fillColor(COLORS.heading).font(FONT.bold).fontSize(11);

  doc.text("Product", COLUMNS.product.x, tableTop + 12, { width: COLUMNS.product.width });
  doc.text("Qty", COLUMNS.qty.x, tableTop + 12, {
    width: COLUMNS.qty.width,
    align: COLUMNS.qty.align,
  });
  doc.text("Rate", COLUMNS.rate.x, tableTop + 12, {
    width: COLUMNS.rate.width,
    align: COLUMNS.rate.align,
  });
  doc.text("Amount", COLUMNS.amount.x, tableTop + 12, {
    width: COLUMNS.amount.width,
    align: COLUMNS.amount.align,
  });
}

/**
 * Draws every line item row beneath the table header.
 * Returns the y-coordinate immediately after the last row, so the
 * caller knows where to continue drawing (e.g. the grand total box).
 */
function drawLineItems(doc, items, tableTop) {
  let y = tableTop + 45;

  items.forEach((item) => {
    doc
      .moveTo(CONTENT_LEFT, y + 20)
      .lineTo(CONTENT_RIGHT, y + 20)
      .strokeColor(COLORS.rowDivider)
      .stroke();

    doc.font(FONT.body).fontSize(10).fillColor(COLORS.text);

    doc.text(item.productName, COLUMNS.product.x, y, { width: COLUMNS.product.width });
    doc.text(String(item.quantity), COLUMNS.qty.x, y, {
      width: COLUMNS.qty.width,
      align: COLUMNS.qty.align,
    });
    doc.text(formatINR(item.price), COLUMNS.rate.x, y, {
      width: COLUMNS.rate.width,
      align: COLUMNS.rate.align,
    });
    doc.text(formatINR(item.subtotal), COLUMNS.amount.x, y, {
      width: COLUMNS.amount.width,
      align: COLUMNS.amount.align,
    });

    y += ROW_HEIGHT;
  });

  return y;
}

/**
 * Draws the grand total banner.
 * Returns the y-coordinate immediately beneath the banner.
 */
function drawGrandTotal(doc, totalAmount, startY) {
  const boxY = startY + 25;
  const boxHeight = 50;
  const boxWidth = 225;
  const boxX = CONTENT_RIGHT - boxWidth;

  doc.fillColor(COLORS.brand).rect(boxX, boxY, boxWidth, boxHeight).fill();

  doc
    .fillColor(COLORS.white)
    .font(FONT.bold)
    .fontSize(13)
    .text("GRAND TOTAL", boxX + 15, boxY + 18);

  doc.text(formatINR(totalAmount), COLUMNS.amount.x, boxY + 18, {
    width: COLUMNS.amount.width,
    align: "right",
  });

  return boxY + boxHeight;
}

/**
 * Draws the authorized signature line.
 */
function drawSignature(doc, startY) {
  const y = startY + 25;
  const lineStartX = 380;

  doc.moveTo(lineStartX, y).lineTo(CONTENT_RIGHT - 25, y).strokeColor(COLORS.muted).stroke();

  doc
    .font(FONT.body)
    .fontSize(9)
    .fillColor(COLORS.text)
    .text("Authorized Signature", lineStartX + 5, y + 10)
    .text("Prakash Enterprises", lineStartX + 5, y + 25);
}

/**
 * Draws the footer (GSTIN line + page number) on every buffered page.
 */
function drawFooter(doc) {
  const range = doc.bufferedPageRange();

  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);

    doc
      .moveTo(CONTENT_LEFT, 785)
      .lineTo(CONTENT_RIGHT, 785)
      .strokeColor(COLORS.border)
      .stroke();

    doc
      .font(FONT.body)
      .fontSize(8)
      .fillColor(COLORS.muted)
      .text(
        "GSTIN: 10BNIPP2535B1ZL  |  Prakash Enterprises  |  Authorized Coca-Cola Distributor",
        CONTENT_LEFT,
        800,
        { width: CONTENT_WIDTH, align: "center" }
      )
      .text(`Page ${i + 1} of ${range.count}`, CONTENT_LEFT, 815, {
        width: CONTENT_WIDTH,
        align: "center",
      });
  }
}

/**
 * Generates an order invoice PDF and streams it directly to the
 * given Express response object.
 *
 * @param {object} order - Order document (customerName, customerPhone,
 *   status, items[], totalAmount, _id).
 * @param {import('express').Response} res - Express response to pipe the PDF into.
 */
const generateOrderPDF = (order, res) => {
  const doc = new PDFDocument({ size: "A4", margin: PAGE_MARGIN, bufferPages: true });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=invoice-${order._id}.pdf`);

  doc.pipe(res);

  const date = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const invoiceNo = buildInvoiceNumber(order._id);

  drawHeader(doc, { invoiceNo, date });
  drawInfoBoxes(doc, order, { invoiceNo, date });

  const tableTop = 300;
  drawTableHeader(doc, tableTop);
  const afterItemsY = drawLineItems(doc, order.items, tableTop);
  const afterTotalY = drawGrandTotal(doc, order.totalAmount, afterItemsY);
  drawSignature(doc, afterTotalY);

  drawFooter(doc);

  doc.end();
};

module.exports = generateOrderPDF;