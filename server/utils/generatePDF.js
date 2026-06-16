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
    doc.image(
      logoPath,
      40,
      30,
      {
        width: 85,
      }
    );
  } catch (error) {
    console.log(
      "Logo not found"
    );
  }

  // ====================================
  // COMPANY HEADER
  // ====================================

  doc
    .fillColor("#b91c1c")
    .fontSize(24)
    .font("Helvetica-Bold")
    .text(
      "PRAKASH ENTERPRISES",
      140,
      35
    );

  doc
    .fillColor("#374151")
    .fontSize(10)
    .font("Helvetica")
    .text(
      "Prop. Brajesh Prasad",
      140,
      65
    );

  doc.text(
    "Authorized Coca-Cola Distributor",
    140,
    80
  );

  doc.text(
    "Kohara Bazar, Bareza Road, Saran",
    140,
    95
  );

  doc.text(
    "Phone: +91 9631032305",
    140,
    110
  );

  doc
    .fontSize(16)
    .font("Helvetica-Bold")
    .fillColor("#111827")
    .text(
      "PURCHASE ORDER",
      400,
      40
    );

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#374151")
    .text(
      `Invoice No: ${invoiceNo}`,
      380,
      70
    );

  doc.text(
    `Date: ${today}`,
    380,
    85
  );

  doc.moveTo(40, 145)
    .lineTo(555, 145)
    .strokeColor("#d1d5db")
    .stroke();

  // ====================================
  // CUSTOMER BOX
  // ====================================

  doc.rect(
    40,
    160,
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
    160,
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

  let tableTop = 280;

  doc
    .fillColor("#f3f4f6")
    .rect(
      40,
      tableTop,
      515,
      30
    )
    .fill();

  doc
    .fillColor("#111827")
    .fontSize(10)
    .font("Helvetica-Bold");

  doc.text(
    "Product",
    55,
    tableTop + 10
  );

  doc.text(
    "Qty",
    300,
    tableTop + 10
  );

  doc.text(
    "Rate",
    380,
    tableTop + 10
  );

  doc.text(
    "Amount",
    470,
    tableTop + 10
  );

  let y = tableTop + 35;

  order.items.forEach(
    (item) => {
      doc
        .moveTo(
          40,
          y + 18
        )
        .lineTo(
          555,
          y + 18
        )
        .strokeColor(
          "#f3f4f6"
        )
        .stroke();

      doc
        .fontSize(10)
        .font(
          "Helvetica"
        )
        .fillColor(
          "#374151"
        );

      doc.text(
        item.productName,
        55,
        y
      );

      doc.text(
        item.quantity.toString(),
        300,
        y
      );

      doc.text(
        `₹${item.price}`,
        380,
        y
      );

      doc.text(
        `₹${item.subtotal}`,
        470,
        y
      );

      y += 30;
    }

  );

  // ====================================
  // TOTAL BOX
  // ====================================

  y += 25;

  doc
    .fillColor("#dcfce7")
    .rect(
      340,
      y,
      215,
      45
    )
    .fill();

  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .fillColor("#166534")
    .text(
      "GRAND TOTAL",
      355,
      y + 15
    );

  doc.text(
    `₹${Number(
      order.totalAmount
    ).toLocaleString(
      "en-IN"
    )}`,
    455,
    y + 15
  );

  // ====================================
  // SIGNATURE
  // ====================================

  y += 100;

  doc
    .moveTo(
      380,
      y
    )
    .lineTo(
      530,
      y
    )
    .strokeColor(
      "#6b7280"
    )
    .stroke();

  doc
    .fontSize(9)
    .fillColor(
      "#374151"
    )
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
      .fillColor(
        "#6b7280"
      )
      .text(
        "PRAKASH ENTERPRISES | AUTHORIZED COCA-COLA DISTRIBUTOR",
        40,
        795,
        {
          align:
            "center",
        }
      );

    doc.text(
      "GSTIN : 10BNIPP2535B1ZL",
      40,
      808,
      {
        align:
          "center",
      }
    );

    doc.text(
      `Page ${i + 1
      } of ${range.count
      }`,
      40,
      821,
      {
        align:
          "center",
      }
    );

  }

  doc.end();
};

module.exports =
  generateOrderPDF;
