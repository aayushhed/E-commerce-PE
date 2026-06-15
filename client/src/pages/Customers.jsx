import { useEffect, useState } from "react";
import API from "../services/api";

function Customers() {
  const [customers, setCustomers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [name, setName] =
    useState("");

  const [username, setUsername] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  const fetchCustomers = async () => {
    try {
      const { data } = await API.get(
        "/customers",
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      setCustomers(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const createCustomerHandler =
    async (e) => {
      e.preventDefault();

      try {
        await API.post(
          "/customers",
          {
            name,
            username,
            phone,
            password,
          },
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        setName("");
        setUsername("");
        setPhone("");
        setPassword("");

        fetchCustomers();

        alert(
          "Customer Created Successfully"
        );
      } catch (error) {
        alert(
          "Failed To Create Customer"
        );
      }
    };

  const deleteCustomerHandler =
    async (id) => {
      if (
        !window.confirm(
          "Delete Customer?"
        )
      )
        return;

      try {
        await API.delete(
          `/customers/${id}`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        fetchCustomers();
      } catch (error) {
        alert("Delete Failed");
      }
    };

  const filteredCustomers =
    customers.filter(
      (customer) =>
        customer.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        customer.username
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-7xl mx-auto">

        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h1 className="text-3xl font-bold">
            Customer Management
          </h1>

          <p className="text-gray-500">
            Manage retailer accounts
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            Add New Customer
          </h2>

          <form
            onSubmit={
              createCustomerHandler
            }
            className="grid md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              placeholder="Shop Name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value
                )
              }
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="border p-3 rounded-lg"
              required
            />

            <button
              type="submit"
              className="bg-blue-600 text-white rounded-lg p-3"
            >
              Create Customer
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <input
            type="text"
            placeholder="Search Customer..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <h2 className="text-2xl font-bold mb-4">
          Customers (
          {
            filteredCustomers.length
          }
          )
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

          {filteredCustomers.map(
            (customer) => (
              <div
                key={customer._id}
                className="bg-white rounded-2xl shadow p-5 hover:shadow-xl transition"
              >
                <div className="flex items-center gap-3 mb-4">

                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                    {customer.name
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <h3 className="font-bold text-lg">
                      {
                        customer.name
                      }
                    </h3>

                    <p className="text-gray-500">
                      Retailer
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p>
                    <strong>
                      Username:
                    </strong>{" "}
                    {
                      customer.username
                    }
                  </p>

                  <p>
                    <strong>
                      Phone:
                    </strong>{" "}
                    {customer.phone}
                  </p>
                </div>

                <button
                  onClick={() =>
                    deleteCustomerHandler(
                      customer._id
                    )
                  }
                  className="mt-5 w-full bg-red-600 text-white py-2 rounded-lg"
                >
                  Delete Customer
                </button>
              </div>
            )
          )}

        </div>
      </div>
    </div>
  );
}

export default Customers;