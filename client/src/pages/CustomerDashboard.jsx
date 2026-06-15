import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function CustomerDashboard() {
  const navigate = useNavigate();

  const [products, setProducts] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [quantities, setQuantities] =
    useState({});

  const [openBrand, setOpenBrand] =
    useState(null);

  useEffect(() => {
    const fetchProducts =
      async () => {
        try {
          const { data } =
            await API.get(
              "/products"
            );

          setProducts(data);
        } catch (error) {
          console.log(error);
        }
      };

    fetchProducts();
  }, []);

  const increaseQuantity = (
    productId
  ) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]:
        (prev[productId] || 1) +
        1,
    }));
  };

  const decreaseQuantity = (
    productId
  ) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(
        1,
        (prev[productId] || 1) -
          1
      ),
    }));
  };

  const addToCart = (
    product
  ) => {
    const quantity =
      quantities[product._id] || 1;

    let cart =
      JSON.parse(
        localStorage.getItem(
          "cart"
        )
      ) || [];

    const existingProduct =
      cart.find(
        (item) =>
          item._id ===
          product._id
      );

    if (existingProduct) {
      existingProduct.quantity +=
        quantity;
    } else {
      cart.push({
        ...product,
        quantity,
      });
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

    alert(
      `${quantity} ${product.name} added to cart`
    );
  };

  const logoutHandler = () => {
    localStorage.removeItem(
      "userInfo"
    );

    navigate("/");
  };

  const cart =
    JSON.parse(
      localStorage.getItem("cart")
    ) || [];

  const cartItems = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  const groupedProducts =
    products.reduce(
      (acc, product) => {
        if (
          !acc[product.brand]
        ) {
          acc[product.brand] = [];
        }

        acc[
          product.brand
        ].push(product);

        return acc;
      },
      {}
    );

  const filteredBrands =
    Object.entries(
      groupedProducts
    ).filter(([brand]) =>
      brand
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}

      <div className="bg-red-600 text-white p-5 shadow-lg">
        <h1 className="text-2xl font-bold">
          Prakash Enterprises
        </h1>

        <p>
          Beverage Ordering Portal
        </p>
      </div>

      <div className="p-4">

        {/* TOP BUTTONS */}

        <div className="flex flex-wrap gap-2 mb-5">

          <button
            onClick={() =>
              navigate("/cart")
            }
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Cart (
            {cartItems}
            )
          </button>

          <button
            onClick={() =>
              navigate(
                "/my-orders"
              )
            }
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            My Orders
          </button>

          <button
            onClick={
              logoutHandler
            }
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>

        {/* SEARCH */}

        <input
          type="text"
          placeholder="Search Brand..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="w-full p-3 rounded-lg border bg-white mb-5"
        />

        {/* BRANDS */}

        <div className="space-y-4">

          {filteredBrands.map(
            ([
              brand,
              brandProducts,
            ]) => (
              <div
                key={brand}
                className="bg-white rounded-xl shadow"
              >

                <button
                  onClick={() =>
                    setOpenBrand(
                      openBrand ===
                        brand
                        ? null
                        : brand
                    )
                  }
                  className="w-full flex justify-between items-center p-5"
                >
                  <h2 className="text-2xl font-bold">
                    🥤 {brand}
                  </h2>

                  <span className="text-xl">
                    {openBrand ===
                    brand
                      ? "▲"
                      : "▼"}
                  </span>
                </button>

                {openBrand ===
                  brand && (
                  <div className="border-t p-4 space-y-4">

                    {brandProducts.map(
                      (
                        product
                      ) => (
                        <div
                          key={
                            product._id
                          }
                          className="border rounded-xl p-4"
                        >

                          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                            <div>
                              <h3 className="font-bold text-lg">
                                {
                                  product.name
                                }
                              </h3>

                              <p className="text-green-600 text-xl font-bold">
                                ₹
                                {
                                  product.price
                                }
                              </p>

                              <p className="text-sm text-gray-500">
                                Available
                              </p>
                            </div>

                            <div className="flex items-center gap-3">

                              <button
                                onClick={() =>
                                  decreaseQuantity(
                                    product._id
                                  )
                                }
                                className="bg-gray-300 px-3 py-1 rounded"
                              >
                                -
                              </button>

                              <span className="font-bold">
                                {quantities[
                                  product
                                    ._id
                                ] || 1}
                              </span>

                              <button
                                onClick={() =>
                                  increaseQuantity(
                                    product._id
                                  )
                                }
                                className="bg-gray-300 px-3 py-1 rounded"
                              >
                                +
                              </button>

                            </div>

                          </div>

                          <button
                            onClick={() =>
                              addToCart(
                                product
                              )
                            }
                            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                          >
                            Add To Cart
                          </button>

                        </div>
                      )
                    )}

                  </div>
                )}

              </div>
            )
          )}

          {filteredBrands.length ===
            0 && (
            <div className="bg-white rounded-xl shadow p-5 text-center">
              No brands found
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default CustomerDashboard;