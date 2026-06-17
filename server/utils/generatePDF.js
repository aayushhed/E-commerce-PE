const PDFDocument = require("pdfkit");
const path = require("path");

const generateOrderPDF = (order, res) => {
  const doc = new PDFDocument({
    size: "A4",
    margin: 40,
    bufferPages: true,
  });

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${order._id}.pdf`
  );

  doc.pipe(res);

  const logoPath = path.join(
    __dirname,
    "../assets/coca-cola-logo.png"
  );

  const today = new Date().toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

  const invoiceNo =
    "PE-" +
    order._id
      .toString()
      .slice(-6)
      .toUpperCase();

  // ====================================
  // LOGO
  // ====================================

try {
  doc.image(logoPath, 40, 25, {
    width: 120,
  });
} catch (err) {
  console.log("Logo not found");
}

doc
  .fillColor("#b91c1c")
  .fontSize(24)
  .font("Helvetica-Bold")
  .text(
    "PRAKASH ENTERPRISES",
    170,
    35
  );

doc
  .fillColor("#374151")
  .fontSize(11)
  .font("Helvetica")
  .text(
    "Prop. Brajesh Prasad",
    170,
    68
  );

doc.text(
  "Authorized Coca-Cola Distributor",
  170,
  85
);

doc.text(
  "Kohara Bazar, Bareza Road, Saran",
  170,
  102
);

doc.text(
  "Phone: +91 9631032305",
  170,
  119
);

doc
  .fillColor("#111827")
  .fontSize(20)
  .font("Helvetica-Bold")
  .text(
    "PURCHASE ORDER",
    360,
    45
  );

doc
  .fontSize(11)
  .font("Helvetica")
  .fillColor("#374151")
  .text(
    `Invoice No: ${invoiceNo}`,
    360,
    80
  );

doc.text(
  `Date: ${today}`,
  360,
  100
);

doc.moveTo(40, 155)
  .lineTo(555, 155)
  .strokeColor("#d1d5db")
  .stroke();


  // ====================================
  // CUSTOMER BOX
  // ====================================

  doc.rect(
    40,
    175,
    250,
    90
  ).stroke();

  doc
    .fontSize(11)
    .font("Helvetica-Bold")
    .fillColor("#1f2937")
    .text(
      "CUSTOMER DETAILS",
      50,
      170
    );

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(
      `Name: ${order.customerName ||
      "Customer"
      }`,
      50,
      195
    );

  doc.text(
    `Phone: ${order.customerPhone ||
    "-"
    }`,
    50,
    215
  );

  // ====================================
  // ORDER BOX
  // ====================================

  doc.rect(
    305,
    175,
    250,
    90
  ).stroke();

  doc
    .fontSize(11)
    .font("Helvetica-Bold")
    .text(
      "ORDER DETAILS",
      315,
      170
    );

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(
      `Invoice: ${invoiceNo}`,
      315,
      195
    );

  doc.text(
    `Date: ${today}`,
    315,
    215
  );

  doc.text(
    `Status: ${order.status
    }`,
    315,
    235
  );

  // ====================================
  // TABLE HEADER
  // ====================================

  let tableTop = 300;

  doc
    .fillColor("#f3f4f6")
    .rect(40, tableTop, 515, 35)
    .fill();

  doc
    .fillColor("#111827")
    .fontSize(11)
    .font("Helvetica-Bold");

  doc.text("Product", 60, tableTop + 12);

  doc.text(
    "Qty",
    270,
    tableTop + 12,
    {
      width: 60,
      align: "center",
    }
  );

  doc.text(
    "Rate",
    350,
    tableTop + 12,
    {
      width: 80,
      align: "right",
    }
  );

  doc.text(
    "Amount",
    450,
    tableTop + 12,
    {
      width: 90,
      align: "right",
    }
  );

  let y = tableTop + 45;

  order.items.forEach((item) => {
    doc
      .moveTo(40, y + 20)
      .lineTo(555, y + 20)
      .strokeColor("#f3f4f6")
      .stroke();

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#374151");

    doc.text(
      item.productName,
      60,
      y
    );

    doc.text(
      item.quantity.toString(),
      270,
      y,
      {
        width: 60,
        align: "center",
      }
    );

    doc.text(
      `₹${Number(item.price).toLocaleString("en-IN")}`,
      350,
      y,
      {
        width: 80,
        align: "right",
      }
    );

    doc.text(
      `₹${Number(item.subtotal).toLocaleString("en-IN")}`,
      450,
      y,
      {
        width: 90,
        align: "right",
      }
    );

    y += 30;
  });

  // ====================================
  // TOTAL BOX
  // ====================================

  y += 25;

  doc
    .fillColor("#b91c1c")
    .rect(
      330,
      y,
      225,
      50
    )
    .fill();

  doc
    .fillColor("#ffffff")
    .fontSize(13)
    .font("Helvetica-Bold")
    .text(
      "GRAND TOTAL",
      345,
      y + 18
    );

  doc.text(
    `₹${Number(order.totalAmount).toLocaleString("en-IN")}`,
    450,
    y + 18,
    {
      width: 90,
      align: "right",
    }
  );

  // ====================================
  // SIGNATURE
  // ====================================

  y += 75;

  doc
    .moveTo(380, y)
    .lineTo(530, y)
    .strokeColor("#6b7280")
    .stroke();

  doc
    .fontSize(9)
    .fillColor("#374151")
    .text(
      "Authorized Signature",
      385,
      y + 10
    );

  doc.text(
    "Prakash Enterprises",
    385,
    y + 25
  );

  // ====================================
  // FOOTER
  // ====================================

  const range =
    doc.bufferedPageRange();

  for (
    let i =
      range.start;
    i <
    range.start +
    range.count;
    i++
  ) {
    doc.switchToPage(i);

    doc
      .moveTo(
        40,
        785
      )
      .lineTo(
        555,
        785
      )
      .strokeColor(
        "#d1d5db"
      )
      .stroke();

    doc
      .fontSize(8)
      .fillColor("#6b7280")
      .text(
        "GSTIN : 10BNIPP2535B1ZL | PRAKASH ENTERPRISES | AUTHORIZED COCA-COLA DISTRIBUTOR",
        40,
        800,
        {
          align: "center",
        }
      );

    doc.text(
      `Page ${i + 1} of ${range.count}`,
      40,
      815,
      {
        align: "center",
      }
    );

  }

  doc.end();
};

module.exports =
  generateOrderPDF;
