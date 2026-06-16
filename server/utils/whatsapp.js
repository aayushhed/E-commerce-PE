const generateWhatsAppLink = (
  phone,
  orderId
) => {
  const pdfUrl =
    `https://prakash-enterprises-api.onrender.com/api/orders/${orderId}/pdf`;

  const message =
    `Prakash Enterprises%0A%0AYour order is ready.%0A%0ADownload Invoice:%0A${pdfUrl}`;

  return `https://wa.me/91${phone}?text=${message}`;
};

module.exports = generateWhatsAppLink;