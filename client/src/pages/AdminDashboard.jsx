import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userInfo = JSON.parse(
          localStorage.getItem("userInfo")
        );

        const { data } = await API.get(
          "/orders/dashboard/stats",
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        setStats(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStats();
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}

      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold">
            Prakash Enterprises
          </h1>

          <p className="text-slate-300 mt-2">
            Beverage Wholesaler Dashboard
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">

        {/* Stats */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">

          <div className="bg-white rounded-2xl shadow p-5">
            <p className="text-gray-500">
              Total Orders
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {stats.totalOrders}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-5">
            <p className="text-gray-500">
              Customers
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {stats.totalCustomers}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-5">
            <p className="text-gray-500">
              Delivered
            </p>

            <h2 className="text-4xl font-bold mt-2 text-green-600">
              {stats.deliveredOrders}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-5">
            <p className="text-gray-500">
              Revenue
            </p>

            <h2 className="text-4xl font-bold mt-2 text-green-600">
              ₹{stats.totalRevenue}
            </h2>
          </div>

        </div>

        {/* Quick Actions */}

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">
            Quick Actions
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

            <button
              onClick={() =>
                navigate(
                  "/admin/products"
                )
              }
              className="bg-blue-600 text-white p-6 rounded-2xl shadow hover:scale-105 transition"
            >
              <div className="text-3xl mb-2">
                📦
              </div>

              <h3 className="font-bold">
                Products
              </h3>

              <p className="text-sm opacity-80">
                Manage Inventory
              </p>
            </button>

            <button
              onClick={() =>
                navigate(
                  "/admin/orders"
                )
              }
              className="bg-green-600 text-white p-6 rounded-2xl shadow hover:scale-105 transition"
            >
              <div className="text-3xl mb-2">
                🛒
              </div>

              <h3 className="font-bold">
                Orders
              </h3>

              <p className="text-sm opacity-80">
                View Orders
              </p>
            </button>

            <button
              onClick={() =>
                navigate(
                  "/admin/customers"
                )
              }
              className="bg-purple-600 text-white p-6 rounded-2xl shadow hover:scale-105 transition"
            >
              <div className="text-3xl mb-2">
                👥
              </div>

              <h3 className="font-bold">
                Customers
              </h3>

              <p className="text-sm opacity-80">
                Manage Customers
              </p>
            </button>

            <button
              onClick={() =>
                navigate(
                  "/admin/create-order"
                )
              }
              className="bg-orange-600 text-white p-6 rounded-2xl shadow hover:scale-105 transition"
            >
              <div className="text-3xl mb-2">
                ➕
              </div>

              <h3 className="font-bold">
                Manual Order
              </h3>

              <p className="text-sm opacity-80">
                Create New Order
              </p>
            </button>

          </div>
        </div>

        {/* Business Overview */}

        <div className="grid lg:grid-cols-2 gap-6 mt-8">

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">
              Business Summary
            </h2>

            <div className="space-y-3">

              <div className="flex justify-between">
                <span>
                  Total Orders
                </span>

                <strong>
                  {
                    stats.totalOrders
                  }
                </strong>
              </div>

              <div className="flex justify-between">
                <span>
                  Total Customers
                </span>

                <strong>
                  {
                    stats.totalCustomers
                  }
                </strong>
              </div>

              <div className="flex justify-between">
                <span>
                  Delivered Orders
                </span>

                <strong>
                  {
                    stats.deliveredOrders
                  }
                </strong>
              </div>

              <div className="flex justify-between">
                <span>
                  Revenue
                </span>

                <strong className="text-green-600">
                  ₹
                  {
                    stats.totalRevenue
                  }
                </strong>
              </div>

            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">
              System Status
            </h2>

            <div className="space-y-3">

              <div className="flex justify-between">
                <span>
                  Database
                </span>

                <span className="text-green-600 font-semibold">
                  Online
                </span>
              </div>

              <div className="flex justify-between">
                <span>
                  Orders Module
                </span>

                <span className="text-green-600 font-semibold">
                  Active
                </span>
              </div>

              <div className="flex justify-between">
                <span>
                  Customer Portal
                </span>

                <span className="text-green-600 font-semibold">
                  Active
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Logout */}

        <div className="mt-8">
          <button
            onClick={logoutHandler}
            className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;