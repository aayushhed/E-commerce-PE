import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const { data } = await API.post(
        "/auth/login",
        {
          username,
          password,
        }
      );

      localStorage.setItem(
        "userInfo",
        JSON.stringify(data)
      );

      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/customer");
      }
    } catch (error) {
      setError("Invalid Username or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center p-4">

      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[length:30px_30px]"></div>
      </div>

      <div className="relative w-full max-w-md">

        <div className="bg-white rounded-3xl shadow-2xl p-8">

          <div className="text-center mb-8">

            <div className="w-20 h-20 mx-auto rounded-full bg-orange-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              PE
            </div>

            <h1 className="text-3xl font-bold mt-4 text-slate-800">
              Prakash Enterprises
            </h1>

            <p className="text-gray-500 mt-2">
              Beverage Ordering Portal
            </p>

          </div>

          <form onSubmit={submitHandler}>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                Username
              </label>

              <input
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            {error && (
              <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition duration-300"
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </button>

          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            Authorized Retailers & Admins Only
          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;