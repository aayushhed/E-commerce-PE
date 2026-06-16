const PDFDocument = require("pdfkit");

const generateOrderPDF = (order, res) => {
  // Use bufferPages: true to allow page range calculation for footers like "Page X of Y"
  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
    bufferPages: true,
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=order-${order._id}.pdf`
  );

  doc.pipe(res);

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  // ==========================================
  // COMPANY HEADER
  // ==========================================
  doc
    .fillColor("#1e3a8a") // Deep Navy Primary Color
    .fontSize(22)
    .font("Helvetica-Bold")
    .text("PRAKASH ENTERPRISES", 50, 50);

  doc
    .fillColor("#4b5563") // Secondary Dark Gray
    .fontSize(9)
    .font("Helvetica")
    .text("Prop. Brajesh Prasad", 50, 75)
    .text("Authorized Coca-Cola Distributor", 50, 89);

  // Document Type Header
  doc
    .fillColor("#6b7280")
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("PURCHASE ORDER", 50, 50, { align: "right" });

  doc
    .fillColor("#4b5563")
    .fontSize(9)
    .font("Helvetica")
    .text(`Date: ${today}`, 50, 75, { align: "right" });

  // Elegant Divider Line
  doc
    .moveTo(50, 110)
    .lineTo(545, 110)
    .strokeColor("#e5e7eb")
    .lineWidth(1)
    .stroke();

  // ==========================================
  // BILL TO & ORDER INFO (Two Columns)
  // ==========================================
  const infoY = 125;
  
  // Left Column: Bill To
  doc
    .fillColor("#1e3a8a")
    .fontSize(9)
    .font("Helvetica-Bold")
    .text("BILL TO", 50, infoY);

  doc
    .fillColor("#111827")
    .fontSize(12)
    .font("Helvetica-Bold")
    .text(order.customerName || "Customer", 50, infoY + 15);

  doc
    .fillColor("#4b5563")
    .fontSize(9.5)
    .font("Helvetica")
    .text(`Phone: ${order.customerPhone || "-"}`, 50, infoY + 32);

  // Right Column: Order Info
  doc
    .fillColor("#1e3a8a")
    .fontSize(9)
    .font("Helvetica-Bold")
    .text("ORDER INFO", 350, infoY);

  doc
    .fillColor("#111827")
    .fontSize(9.5)
    .font("Helvetica")
    .text("Order ID: ", 350, infoY + 15, { continued: true })
    .font("Helvetica-Bold")
    .text(order._id.toString().slice(-8).toUpperCase());

  // Status mapping to colors
  let statusColor = "#f59e0b"; // Pending/Default
  if (order.status === "Delivered") statusColor = "#10b981";
  else if (order.status === "Confirmed") statusColor = "#2563eb";
  else if (order.status === "Cancelled") statusColor = "#ef4444";

  doc
    .font("Helvetica")
    .text("Status: ", 350, infoY + 30, { continued: true })
    .font("Helvetica-Bold")
    .fillColor(statusColor)
    .text(order.status);

  // Elegant Divider Line
  doc
    .moveTo(50, 185)
    .lineTo(545, 185)
    .strokeColor("#e5e7eb")
    .lineWidth(1)
    .stroke();

  // ==========================================
  // PRODUCTS TABLE
  // ==========================================
  const tableTop = 200;

  // Draw Header Background
  doc
    .fillColor("#f9fafb")
    .rect(50, tableTop, 495, 26)
    .fill();

  // Draw Table Headers
  doc.fillColor("#4b5563").fontSize(9.5).font("Helvetica-Bold");
  doc.text("Product Description", 60, tableTop + 8);
  doc.text("Qty", 320, tableTop + 8, { width: 50, align: "right" });
  doc.text("Rate", 390, tableTop + 8, { width: 75, align: "right" });
  doc.text("Amount", 475, tableTop + 8, { width: 65, align: "right" });

  // Table Line
  doc
    .moveTo(50, tableTop + 26)
    .lineTo(545, tableTop + 26)
    .strokeColor("#d1d5db")
    .lineWidth(1)
    .stroke();

  let y = tableTop + 26;

  // Helper function to draw table header on a new page
  const drawTableHeader = (d, newY) => {
    d.fillColor("#f9fafb")
      .rect(50, newY, 495, 26)
      .fill();

    d.fillColor("#4b5563").fontSize(9.5).font("Helvetica-Bold");
    d.text("Product Description", 60, newY + 8);
    d.text("Qty", 320, newY + 8, { width: 50, align: "right" });
    d.text("Rate", 390, newY + 8, { width: 75, align: "right" });
    d.text("Amount", 475, newY + 8, { width: 65, align: "right" });

    d.moveTo(50, newY + 26)
      .lineTo(545, newY + 26)
      .strokeColor("#d1d5db")
      .lineWidth(1)
      .stroke();
  };

  order.items.forEach((item) => {
    // Check for page overflow
    if (y > 670) {
      doc.addPage();
      y = 50;
      drawTableHeader(doc, y);
      y += 26;
    }

    y += 8; // padding

    doc.fillColor("#1f2937").fontSize(9.5).font("Helvetica");
    doc.text(item.productName, 60, y, { width: 250, lineBreak: false });
    doc.text(String(item.quantity), 320, y, { width: 50, align: "right" });
    doc.text(`₹${Number(item.price || 0).toFixed(2)}`, 390, y, { width: 75, align: "right" });
    doc.text(`₹${Number(item.subtotal || 0).toFixed(2)}`, 475, y, { width: 65, align: "right" });

    y += 18; // advance and padding

    // Light row separator
    doc
      .moveTo(50, y)
      .lineTo(545, y)
      .strokeColor("#f3f4f6")
      .lineWidth(0.5)
      .stroke();
  });

  // ==========================================
  // TOTAL BOX
  // ==========================================
  y += 15;

  // Check for overflow before printing Total & Signature
  if (y > 640) {
    doc.addPage();
    y = 50;
  }

  // Draw Grand Total Box
  doc
    .fillColor("#f9fafb")
    .rect(315, y, 230, 38)
    .fill();

  doc
    .rect(315, y, 230, 38)
    .strokeColor("#e5e7eb")
    .lineWidth(1)
    .stroke();

  doc
    .fillColor("#1e3a8a")
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("GRAND TOTAL", 330, y + 14);

  const formattedTotal = Number(order.totalAmount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  doc
    .fillColor("#1e3a8a")
    .fontSize(13)
    .font("Helvetica-Bold")
    .text(`₹${formattedTotal}`, 430, y + 12, { width: 105, align: "right" });

  // ==========================================
  // SIGNATURE SECTION
  // ==========================================
  y = Math.max(y + 80, 680);
  if (y > 720) {
    doc.addPage();
    y = 650;
  }

  doc
    .moveTo(370, y)
    .lineTo(530, y)
    .strokeColor("#9ca3af")
    .lineWidth(0.75)
    .stroke();

  doc
    .fillColor("#4b5563")
    .fontSize(8.5)
    .font("Helvetica")
    .text("Authorized Signature", 370, y + 6, { width: 160, align: "center" })
    .fillColor("#111827")
    .font("Helvetica-Bold")
    .text("Prakash Enterprises", 370, y + 18, { width: 160, align: "center" });

  // ==========================================
  // FOOTER (Multi-page safe)
  // ==========================================
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    
    // Bottom rule
    doc
      .moveTo(50, 785)
      .lineTo(545, 785)
      .strokeColor("#e5e7eb")
      .lineWidth(0.5)
      .stroke();

    doc
      .fillColor("#9ca3af")
      .fontSize(8)
      .font("Helvetica")
      .text("PRAKASH ENTERPRISES • AUTHORIZED COCA-COLA DISTRIBUTOR", 50, 795, { align: "center" })
      .text(`Page ${i + 1} of ${range.count}`, 50, 808, { align: "center" });
  }

  doc.end();
};

module.exports = generateOrderPDF;
