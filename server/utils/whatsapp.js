const generateWhatsAppLink = (
  phone,
  orderId
) => {
  return `https://wa.me/91${phone}?text=Your order is ready. Download PDF: http://localhost:5000/api/orders/${orderId}/pdf`;
};

module.exports = generateWhatsAppLink;