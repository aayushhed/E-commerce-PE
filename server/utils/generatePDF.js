const PDFDocument = require("pdfkit");

const generateOrderPDF = (order, res) => {
  const doc = new PDFDocument();

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=order-${order._id}.pdf`
  );

  doc.pipe(res);

  doc.fontSize(20).text(
    "Prakash Enterprises",
    {
      align: "center",
    }
  );

  doc.moveDown();

  doc.fontSize(12).text(
    `Customer: ${
      order.customerName || "Registered Customer"
    }`
  );

  doc.text(
    `Phone: ${order.customerPhone || "-"}`
  );

  doc.text(`Status: ${order.status}`);

  doc.moveDown();

  doc.text("Products:");

  order.items.forEach((item) => {
    doc.text(
      `${item.productName} | Qty: ${item.quantity} | Price: ₹${item.price} | Total: ₹${item.subtotal}`
    );
  });

  doc.moveDown();

  doc.fontSize(14).text(
    `Grand Total: ₹${order.totalAmount}`
  );

  doc.end();
};

module.exports = generateOrderPDF;