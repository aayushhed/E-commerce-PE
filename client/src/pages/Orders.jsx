import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders/all", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(
        `/orders/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      fetchOrders();
    } catch (error) {
      alert("Status Update Failed");
    }
  };

  const deleteOrder = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      alert("Order Deleted Successfully");
      fetchOrders();
    } catch (error) {
      alert("Delete Failed");
    }
  };

  const openWhatsApp = async (id) => {
    try {
      const { data } = await API.get(`/orders/${id}/whatsapp`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      window.open(data.whatsappLink, "_blank");
    } catch (error) {
      alert("WhatsApp Link Failed");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      case "Confirmed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-green-700 text-white p-5 shadow-lg">
        <h1 className="text-3xl font-bold">Orders Management</h1>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <button
          onClick={() => navigate("/admin")}
          className="mb-4 bg-gray-700 text-white px-4 py-2 rounded-lg"
        >
          Back to Dashboard
        </button>

        {orders.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold">No Orders Found</h2>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow p-5 mb-5"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <h2 className="text-lg font-bold">Order ID</h2>
                  <p className="text-sm text-gray-500 break-all">{order._id}</p>
                </div>

                <span
                  className={`mt-3 md:mt-0 px-3 py-1 rounded-full font-semibold ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mt-4">
                <p>
                  <strong>Customer:</strong>{" "}
                  {order.customerName || order.customer?.name || "Customer"}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {order.customerPhone || order.customer?.phone || "-"}
                </p>

                <p className="text-green-600 font-bold text-xl mt-2">
                  ₹{order.totalAmount}
                </p>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold">Products</h3>

                {order.items.map((item, index) => (
                  <div key={index} className="border-b py-2">
                    {item.productName} × {item.quantity}
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={() => updateStatus(order._id, "Confirmed")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Confirm
                </button>

                <button
                  onClick={() => updateStatus(order._id, "Delivered")}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Delivered
                </button>

                <button
                  onClick={() => updateStatus(order._id, "Cancelled")}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>

                <a
                  href={`${API.defaults.baseURL}/orders/${order._id}/pdf`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                >
                  PDF
                </a>

                <button
                  onClick={() => openWhatsApp(order._id)}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
                >
                  WhatsApp
                </button>

                <button
                  onClick={() => deleteOrder(order._id)}
                  className="bg-red-800 text-white px-4 py-2 rounded-lg"
                >
                  Delete Order
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Orders;
