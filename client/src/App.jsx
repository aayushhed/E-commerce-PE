import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import CreateOrder from "./pages/CreateOrder";
import Customers from "./pages/Customers";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route
          path="/"
          element={<Login />}
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <ProtectedRoute role="admin">
              <Products />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute role="admin">
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/create-order"
          element={
            <ProtectedRoute role="admin">
              <CreateOrder />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/customers"
          element={
            <ProtectedRoute role="admin">
              <Customers />
            </ProtectedRoute>
          }
        />

        {/* Customer Routes */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute role="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute role="customer">
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute role="customer">
              <MyOrders />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;