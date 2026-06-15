import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function MyOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get(
          "/orders/my-orders",
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        setOrders(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrders();
  }, []);

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
      <div className="bg-green-600 text-white p-5 shadow-lg">
        <h1 className="text-2xl font-bold">
          My Orders
        </h1>
      </div>

      <div className="p-4 max-w-5xl mx-auto">
        <button
          onClick={() =>
            navigate("/customer")
          }
          className="mb-4 bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          Back to Products
        </button>

        {orders.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold">
              No Orders Found
            </h2>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow p-5 mb-4"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <h2 className="text-lg font-bold">
                  Order ID:
                  {" "}
                  {order._id}
                </h2>

                <span
                  className={`px-3 py-1 rounded-full font-semibold mt-2 md:mt-0 ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold">
                  Products
                </h3>

                {order.items.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={index}
                      className="border-b py-2"
                    >
                      {item.productName}
                      {" "}
                      ×
                      {" "}
                      {item.quantity}
                    </div>
                  )
                )}
              </div>

              <div className="mt-4">
                <p className="font-bold text-green-600 text-xl">
                  Total:
                  ₹
                  {
                    order.totalAmount
                  }
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={`http://localhost:5000/api/orders/${order._id}/pdf`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Download PDF
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyOrders;