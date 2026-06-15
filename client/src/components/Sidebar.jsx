import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

function AdminSidebar() {
  const location =
    useLocation();

  const navigate =
    useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem(
      "userInfo"
    );

    navigate("/");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: "📊",
    },
    {
      name: "Products",
      path:
        "/admin/products",
      icon: "📦",
    },
    {
      name: "Orders",
      path:
        "/admin/orders",
      icon: "🛒",
    },
    {
      name: "Customers",
      path:
        "/admin/customers",
      icon: "👥",
    },
    {
      name: "Manual Order",
      path:
        "/admin/create-order",
      icon: "➕",
    },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-5">

      <h1 className="text-2xl font-bold text-orange-400 mb-8">
        Prakash
      </h1>

      <div className="space-y-2">

        {menuItems.map(
          (item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block p-3 rounded-lg transition ${
                location.pathname ===
                item.path
                  ? "bg-orange-500"
                  : "hover:bg-slate-800"
              }`}
            >
              {item.icon}
              {" "}
              {item.name}
            </Link>
          )
        )}

      </div>

      <button
        onClick={logoutHandler}
        className="mt-10 w-full bg-red-600 p-3 rounded-lg"
      >
        Logout
      </button>

    </div>
  );
}

export default AdminSidebar;