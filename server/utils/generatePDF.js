const PDFDocument = require("pdfkit");
const fs = require("fs");
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

const ROW_HEIGHT = 32;
const TABLE_HEADER_HEIGHT = 32;

/**
 * Formats a number as a Rupee amount, e.g. 12345 -> "Rs. 12,345"
 *
 * Note: PDFKit's built-in Helvetica font does not include the ₹ glyph,
 * which is why it was rendering as a broken character (¹) in the PDF.
 * "Rs." is used instead so it renders correctly everywhere without
 * needing to embed a custom font.
 */
const formatINR = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

/**
 * Builds a short, human-readable invoice number from the Mongo ObjectId.
 */
const buildInvoiceNumber = (orderId) =>
  `PE-${orderId.toString().slice(-6).toUpperCase()}`;

/**
 * Draws the company logo, name, and contact block, plus the
 * invoice number / date on the right-hand side.
 *
 * If the logo file isn't found, the text block shifts left to fill the
 * gap instead of leaving a blank space where the logo would have been.
 */
function drawHeader(doc, { invoiceNo, date }) {
  const logoPath = path.join(__dirname, "../assets/coca-cola-logo.png");
  const logoWidth = 110;
  const logoExists = fs.existsSync(logoPath);

  if (logoExists) {
    try {
      doc.image(logoPath, CONTENT_LEFT, 30, { width: logoWidth });
    } catch (err) {
      console.warn("generateOrderPDF: failed to draw logo.", err.message);
    }
  } else {
    console.warn("generateOrderPDF: logo not found at", logoPath, "- shifting header left.");
  }

  // When the logo is present, push the text block to its right.
  // When it's missing, start the text block at the page margin instead
  // of leaving an empty gap on the left.
  const textX = logoExists ? CONTENT_LEFT + logoWidth + 20 : CONTENT_LEFT;

  doc
    .fillColor(COLORS.brand)
    .font(FONT.bold)
    .fontSize(22)
    .text("PRAKASH ENTERPRISES", textX, 32);

  doc
    .fillColor(COLORS.text)
    .font(FONT.body)
    .fontSize(10.5)
    .text("Prop. Brajesh Prasad", textX, 62)
    .text("Authorized Coca-Cola Distributor", textX, 78)
    .text("Kohara Bazar, Bareza Road, Saran", textX, 94)
    .text("Phone: +91 9631032305", textX, 110);

  // Invoice no. / date block, right-aligned within the content width
  // so it never collides with the company block regardless of its width.
  const metaWidth = 175;
  const metaX = CONTENT_RIGHT - metaWidth;

  doc
    .font(FONT.body)
    .fontSize(10.5)
    .fillColor(COLORS.text)
    .text(`Invoice No: ${invoiceNo}`, metaX, 62, { width: metaWidth, align: "right" })
    .text(`Date: ${date}`, metaX, 78, { width: metaWidth, align: "right" });

  doc
    .moveTo(CONTENT_LEFT, 138)
    .lineTo(CONTENT_RIGHT, 138)
    .strokeColor(COLORS.border)
    .stroke();
}

/**
 * Draws the two side-by-side info boxes: customer details and order details.
 */
function drawInfoBoxes(doc, order, { invoiceNo, date }) {
  const boxTop = 158;
  const boxHeight = 92;
  const boxWidth = 250;
  const gap = CONTENT_WIDTH - boxWidth * 2; // space between the two boxes
  const labelOffsetY = 14; // distance from box top to its heading
  const firstLineY = 34; // distance from box top to first line of content
  const lineSpacing = 19;

  const customerBoxX = CONTENT_LEFT;
  const orderBoxX = CONTENT_LEFT + boxWidth + gap;

  // Customer details box
  doc.roundedRect(customerBoxX, boxTop, boxWidth, boxHeight, 4).stroke(COLORS.border);

  doc
    .font(FONT.bold)
    .fontSize(10.5)
    .fillColor(COLORS.heading)
    .text("CUSTOMER DETAILS", customerBoxX + 14, boxTop + labelOffsetY);

  doc
    .font(FONT.body)
    .fontSize(10)
    .fillColor(COLORS.text)
    .text(`Name: ${order.customerName || "Customer"}`, customerBoxX + 14, boxTop + firstLineY)
    .text(`Phone: ${order.customerPhone || "-"}`, customerBoxX + 14, boxTop + firstLineY + lineSpacing);

  // Order details box
  doc.roundedRect(orderBoxX, boxTop, boxWidth, boxHeight, 4).stroke(COLORS.border);

  doc
    .font(FONT.bold)
    .fontSize(10.5)
    .fillColor(COLORS.heading)
    .text("ORDER DETAILS", orderBoxX + 14, boxTop + labelOffsetY);

  doc
    .font(FONT.body)
    .fontSize(10)
    .fillColor(COLORS.text)
    .text(`Invoice: ${invoiceNo}`, orderBoxX + 14, boxTop + firstLineY)
    .text(`Date: ${date}`, orderBoxX + 14, boxTop + firstLineY + lineSpacing)
    .text(`Status: ${order.status}`, orderBoxX + 14, boxTop + firstLineY + lineSpacing * 2);

  return boxTop + boxHeight;
}

/**
 * Draws the table header row (Product / Qty / Rate / Amount).
 */
function drawTableHeader(doc, tableTop) {
  doc
    .fillColor(COLORS.tableHeaderBg)
    .rect(CONTENT_LEFT, tableTop, CONTENT_WIDTH, TABLE_HEADER_HEIGHT)
    .fill();

  const textY = tableTop + TABLE_HEADER_HEIGHT / 2 - 5.5;

  doc.fillColor(COLORS.heading).font(FONT.bold).fontSize(10.5);

  doc.text("PRODUCT", COLUMNS.product.x, textY, { width: COLUMNS.product.width });
  doc.text("QTY", COLUMNS.qty.x, textY, {
    width: COLUMNS.qty.width,
    align: COLUMNS.qty.align,
  });
  doc.text("RATE", COLUMNS.rate.x, textY, {
    width: COLUMNS.rate.width,
    align: COLUMNS.rate.align,
  });
  doc.text("AMOUNT", COLUMNS.amount.x, textY, {
    width: COLUMNS.amount.width,
    align: COLUMNS.amount.align,
  });

  // Border directly under the header row to visually close it off
  doc
    .moveTo(CONTENT_LEFT, tableTop + TABLE_HEADER_HEIGHT)
    .lineTo(CONTENT_RIGHT, tableTop + TABLE_HEADER_HEIGHT)
    .strokeColor(COLORS.border)
    .stroke();
}

/**
 * Draws every line item row beneath the table header.
 * Returns the y-coordinate immediately after the last row, so the
 * caller knows where to continue drawing (e.g. the grand total box).
 */
function drawLineItems(doc, items, tableTop) {
  const rowsTop = tableTop + TABLE_HEADER_HEIGHT;

  items.forEach((item, index) => {
    const rowY = rowsTop + index * ROW_HEIGHT;
    const textY = rowY + ROW_HEIGHT / 2 - 5;

    // Zebra striping makes rows easier to scan across, especially on
    // longer invoices.
    if (index % 2 === 1) {
      doc.fillColor(COLORS.rowDivider).rect(CONTENT_LEFT, rowY, CONTENT_WIDTH, ROW_HEIGHT).fill();
    }

    doc.font(FONT.body).fontSize(10).fillColor(COLORS.text);

    doc.text(item.productName, COLUMNS.product.x, textY, { width: COLUMNS.product.width });
    doc.text(String(item.quantity), COLUMNS.qty.x, textY, {
      width: COLUMNS.qty.width,
      align: COLUMNS.qty.align,
    });
    doc.text(formatINR(item.price), COLUMNS.rate.x, textY, {
      width: COLUMNS.rate.width,
      align: COLUMNS.rate.align,
    });
    doc.text(formatINR(item.subtotal), COLUMNS.amount.x, textY, {
      width: COLUMNS.amount.width,
      align: COLUMNS.amount.align,
    });
  });

  const tableBottom = rowsTop + items.length * ROW_HEIGHT;

  // Close the table with a bottom border for a finished, contained look.
  doc
    .moveTo(CONTENT_LEFT, tableBottom)
    .lineTo(CONTENT_RIGHT, tableBottom)
    .strokeColor(COLORS.border)
    .stroke();

  return tableBottom;
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
  const infoBoxBottom = drawInfoBoxes(doc, order, { invoiceNo, date });

  const tableTop = infoBoxBottom + 28;
  drawTableHeader(doc, tableTop);
  const afterItemsY = drawLineItems(doc, order.items, tableTop);
  const afterTotalY = drawGrandTotal(doc, order.totalAmount, afterItemsY);
  drawSignature(doc, afterTotalY);

  drawFooter(doc);

  doc.end();
};

module.exports = generateOrderPDF;