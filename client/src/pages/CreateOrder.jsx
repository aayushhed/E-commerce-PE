import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function CreateOrder() {
  const navigate = useNavigate();

  const [products, setProducts] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [customerName, setCustomerName] =
    useState("");

  const [customerPhone, setCustomerPhone] =
    useState("");

  const [quantities, setQuantities] =
    useState({});

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get(
          "/products"
        );

        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, []);

  const quantityChangeHandler = (
    productId,
    value
  ) => {
    setQuantities({
      ...quantities,
      [productId]: Number(value),
    });
  };

  const createOrderHandler =
    async () => {
      try {
        const items = [];

        products.forEach(
          (product) => {
            const qty =
              quantities[
                product._id
              ];

            if (
              qty &&
              qty > 0
            ) {
              items.push({
                productId:
                  product._id,
                quantity: qty,
              });
            }
          }
        );

        if (
          items.length === 0
        ) {
          alert(
            "Please select products"
          );
          return;
        }

        await API.post(
          "/orders/manual",
          {
            customerName,
            customerPhone,
            items,
          },
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        alert(
          "Order Created Successfully"
        );

        navigate(
          "/admin/orders"
        );
      } catch (error) {
        alert(
          "Failed To Create Order"
        );
      }
    };

  const filteredProducts =
    products.filter(
      (product) =>
        product.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  const grandTotal =
    products.reduce(
      (total, product) => {
        const qty =
          quantities[
            product._id
          ] || 0;

        return (
          total +
          product.price *
            qty
        );
      },
      0
    );

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-7xl mx-auto">

        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h1 className="text-3xl font-bold">
            Create Manual Order
          </h1>

          <p className="text-gray-500">
            Phone Orders &
            Walk-In Orders
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2">

            <div className="bg-white rounded-2xl shadow p-6 mb-6">

              <h2 className="text-xl font-bold mb-4">
                Customer Information
              </h2>

              <div className="grid md:grid-cols-2 gap-4">

                <input
                  type="text"
                  placeholder="Customer Name"
                  value={
                    customerName
                  }
                  onChange={(e) =>
                    setCustomerName(
                      e.target.value
                    )
                  }
                  className="border p-3 rounded-lg"
                />

                <input
                  type="text"
                  placeholder="Customer Phone"
                  value={
                    customerPhone
                  }
                  onChange={(e) =>
                    setCustomerPhone(
                      e.target.value
                    )
                  }
                  className="border p-3 rounded-lg"
                />

              </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6 mb-6">

              <input
                type="text"
                placeholder="Search Products..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="w-full border p-3 rounded-lg"
              />

            </div>

            <div className="grid md:grid-cols-2 gap-4">

              {filteredProducts.map(
                (product) => (
                  <div
                    key={
                      product._id
                    }
                    className="bg-white rounded-2xl shadow p-5"
                  >
                    <h3 className="font-bold text-lg">
                      {
                        product.name
                      }
                    </h3>

                    <p className="text-gray-500">
                      {
                        product.category
                      }
                    </p>

                    <p className="text-green-600 text-2xl font-bold mt-2">
                      ₹
                      {
                        product.price
                      }
                    </p>

                    <input
                      type="number"
                      min="0"
                      placeholder="Quantity"
                      value={
                        quantities[
                          product
                            ._id
                        ] || ""
                      }
                      onChange={(
                        e
                      ) =>
                        quantityChangeHandler(
                          product._id,
                          e.target
                            .value
                        )
                      }
                      className="w-full border p-3 rounded-lg mt-4"
                    />
                  </div>
                )
              )}

            </div>

          </div>

          <div>

            <div className="bg-white rounded-2xl shadow p-6 sticky top-5">

              <h2 className="text-xl font-bold mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 max-h-96 overflow-y-auto">

                {products
                  .filter(
                    (product) =>
                      quantities[
                        product
                          ._id
                      ] > 0
                  )
                  .map(
                    (
                      product
                    ) => (
                      <div
                        key={
                          product._id
                        }
                        className="flex justify-between"
                      >
                        <span>
                          {
                            product.name
                          }
                          {" "}
                          ×
                          {" "}
                          {
                            quantities[
                              product
                                ._id
                            ]
                          }
                        </span>

                        <span>
                          ₹
                          {product.price *
                            quantities[
                              product
                                ._id
                            ]}
                        </span>
                      </div>
                    )
                  )}

              </div>

              <hr className="my-4" />

              <h3 className="text-2xl font-bold text-green-600">
                ₹
                {grandTotal}
              </h3>

              <button
                onClick={
                  createOrderHandler
                }
                className="w-full bg-green-600 text-white py-3 rounded-lg mt-4 font-bold"
              >
                Create Order
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default CreateOrder;