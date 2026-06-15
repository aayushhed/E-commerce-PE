import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(
    JSON.parse(
      localStorage.getItem("cart")
    ) || []
  );

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  const updateCart = (newCart) => {
    setCart(newCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(newCart)
    );
  };

  const increaseQuantity = (id) => {
    const newCart = cart.map((item) =>
      item._id === id
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    );

    updateCart(newCart);
  };

  const decreaseQuantity = (id) => {
    const newCart = cart.map((item) =>
      item._id === id
        ? {
            ...item,
            quantity: Math.max(
              1,
              item.quantity - 1
            ),
          }
        : item
    );

    updateCart(newCart);
  };

  const removeItem = (id) => {
    const newCart = cart.filter(
      (item) => item._id !== id
    );

    updateCart(newCart);
  };

  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  const placeOrderHandler =
    async () => {
      try {
        const items = cart.map(
          (item) => ({
            productId: item._id,
            quantity: item.quantity,
          })
        );

        await API.post(
          "/orders",
          { items },
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        localStorage.removeItem(
          "cart"
        );

        alert(
          "Order Placed Successfully"
        );

        navigate("/customer");
      } catch (error) {
        console.log(error);

        alert(
          "Failed To Place Order"
        );
      }
    };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-600 text-white p-5 shadow-lg">
        <h1 className="text-2xl font-bold">
          Shopping Cart
        </h1>
      </div>

      <div className="p-4 max-w-4xl mx-auto">
        <button
          onClick={() =>
            navigate("/customer")
          }
          className="mb-4 bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          Back to Products
        </button>

        {cart.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h2 className="text-2xl font-bold">
              Cart is Empty
            </h2>

            <p className="text-gray-500 mt-2">
              Add products to place an order.
            </p>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow p-4 mb-4"
              >
                <h2 className="text-xl font-bold">
                  {item.name}
                </h2>

                <p className="text-green-600 font-bold">
                  ₹{item.price}
                </p>

                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() =>
                      decreaseQuantity(
                        item._id
                      )
                    }
                    className="bg-gray-300 px-3 py-1 rounded"
                  >
                    -
                  </button>

                  <span className="font-bold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      increaseQuantity(
                        item._id
                      )
                    }
                    className="bg-gray-300 px-3 py-1 rounded"
                  >
                    +
                  </button>
                </div>

                <p className="mt-3 font-semibold">
                  Item Total: ₹
                  {item.price *
                    item.quantity}
                </p>

                <button
                  onClick={() =>
                    removeItem(
                      item._id
                    )
                  }
                  className="mt-3 bg-red-500 text-white px-4 py-2 rounded"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="bg-white rounded-xl shadow p-5 mt-6">
              <h2 className="text-2xl font-bold">
                Grand Total
              </h2>

              <p className="text-3xl text-green-600 font-bold mt-2">
                ₹{total}
              </p>

              <button
                onClick={
                  placeOrderHandler
                }
                className="mt-5 w-full bg-green-600 text-white py-3 rounded-xl font-bold text-lg"
              >
                Place Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;