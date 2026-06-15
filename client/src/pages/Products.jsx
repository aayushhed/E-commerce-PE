import { useEffect, useState } from "react";
import API from "../services/api";

function Products() {
  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  const [products, setProducts] =
    useState([]);
  const [search, setSearch] =
    useState("");

  const [name, setName] =
    useState("");
  const [brand, setBrand] =
    useState("");
  const [category, setCategory] =
    useState("");
  const [unit, setUnit] =
    useState("Case");
  const [price, setPrice] =
    useState("");
  const [stock, setStock] =
    useState("");

  const [editingId, setEditingId] =
    useState(null);

  const fetchProducts = async () => {
    try {
      const { data } =
        await API.get("/products");

      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setName("");
    setBrand("");
    setCategory("");
    setUnit("Case");
    setPrice("");
    setStock("");
    setEditingId(null);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const productData = {
        name,
        brand,
        category,
        unit,
        price: Number(price),
        stock: Number(stock),
      };

      if (editingId) {
        await API.put(
          `/products/${editingId}`,
          productData,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        alert("Product Updated");
      } else {
        await API.post(
          "/products",
          productData,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        alert("Product Added");
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      alert("Operation Failed");
    }
  };

  const editHandler = (product) => {
    setEditingId(product._id);

    setName(product.name);
    setBrand(product.brand);
    setCategory(product.category);
    setUnit(product.unit);
    setPrice(product.price);
    setStock(product.stock);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteHandler = async (
    id
  ) => {
    if (
      !window.confirm(
        "Delete Product?"
      )
    )
      return;

    try {
      await API.delete(
        `/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      fetchProducts();
    } catch (error) {
      alert("Delete Failed");
    }
  };

  const filteredProducts =
    products.filter((product) =>
      product.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  const stockBadge = (stock) => {
    if (stock === 0)
      return (
        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
          Out of Stock
        </span>
      );

    if (stock <= 20)
      return (
        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
          Low Stock
        </span>
      );

    return (
      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
        In Stock
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-7xl mx-auto">

        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h1 className="text-3xl font-bold">
            Product Management
          </h1>

          <p className="text-gray-500">
            Manage beverage inventory
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingId
              ? "Edit Product"
              : "Add Product"}
          </h2>

          <form
            onSubmit={submitHandler}
            className="grid md:grid-cols-3 gap-3"
          >
            <input
              type="text"
              placeholder="Product Name"
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
              placeholder="Brand"
              value={brand}
              onChange={(e) =>
                setBrand(
                  e.target.value
                )
              }
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="text"
              placeholder="Unit"
              value={unit}
              onChange={(e) =>
                setUnit(
                  e.target.value
                )
              }
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) =>
                setPrice(
                  e.target.value
                )
              }
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="number"
              placeholder="Stock"
              value={stock}
              onChange={(e) =>
                setStock(
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
              {editingId
                ? "Update Product"
                : "Add Product"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-600 text-white rounded-lg p-3"
            >
              Clear
            </button>
          </form>
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

        <h2 className="text-2xl font-bold mb-4">
          Products (
          {
            filteredProducts.length
          }
          )
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map(
            (product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow p-5 hover:shadow-xl transition"
              >
                <h2 className="text-xl font-bold">
                  {product.name}
                </h2>

                <p className="text-gray-500">
                  {product.brand}
                </p>

                <p className="mt-2">
                  Category:
                  {" "}
                  {
                    product.category
                  }
                </p>

                <p>
                  Unit:
                  {" "}
                  {product.unit}
                </p>

                <p className="text-2xl font-bold text-green-600 mt-3">
                  ₹
                  {
                    product.price
                  }
                </p>

                <div className="mt-3">
                  {stockBadge(
                    product.stock
                  )}
                </div>

                <p className="mt-2 text-sm text-gray-500">
                  Stock:
                  {" "}
                  {
                    product.stock
                  }
                </p>

                <div className="flex gap-2 mt-5">
                  <button
                    onClick={() =>
                      editHandler(
                        product
                      )
                    }
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteHandler(
                        product._id
                      )
                    }
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
}

export default Products;