import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type Product,
} from "../../api/products";
import { createStock } from "../../api/stock";
import api from "../../api/client";

interface Category {
  id: number;
  name: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Stock modal state
  const [stockModal, setStockModal] = useState<{
    productId: number | null;
    type: "IN" | "OUT";
  }>({ productId: null, type: "IN" });

  const [stockQty, setStockQty] = useState("");
  const [stockNote, setStockNote] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category_id: "",
  });

  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const fetchCategories = async () => {
    const res = await api.get("/categories/");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch {
      alert("You are not allowed to delete this product");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.category_id) {
      alert("Please fill all required fields");
      return;
    }

    const data = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      quantity: Number(form.quantity),
      category_id: Number(form.category_id),
    };

    try {
      if (editingId) {
        await updateProduct(editingId, data);
        setEditingId(null);
      } else {
        await createProduct(data);
      }

      setForm({
        name: "",
        description: "",
        price: "",
        quantity: "",
        category_id: "",
      });

      fetchProducts();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Error saving product");
    }
  };

  // Stock submit
  const handleStockSubmit = async () => {
    if (!stockModal.productId || !stockQty) return;

    try {
      await createStock({
        product_id: stockModal.productId,
        type: stockModal.type,
        quantity: Number(stockQty),
        note: stockNote,
      });

      setStockModal({ productId: null, type: "IN" });
      setStockQty("");
      setStockNote("");
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Stock error");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      {/* Product Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6"
      >
        <div className="grid grid-cols-5 gap-4">
          <input
            name="name"
            placeholder="Name"
            className="border p-2"
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="description"
            placeholder="Description"
            className="border p-2"
            value={form.description}
            onChange={handleChange}
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            className="border p-2"
            value={form.price}
            onChange={handleChange}
          />

          <input
            name="quantity"
            type="number"
            placeholder="Quantity"
            className="border p-2"
            value={form.quantity}
            onChange={handleChange}
          />

          <select
            name="category_id"
            className="border p-2"
            value={form.category_id}
            onChange={handleChange}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 mt-4 rounded">
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Products Table */}
      <div className="bg-white rounded shadow">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Quantity</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
  key={p.id}
  className={`border-t ${p.quantity < 5 ? "bg-red-100" : ""}`}
>
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.description}</td>
                <td className="p-2">${p.price}</td>
                <td className="p-2">{p.quantity}</td>
                <td className="p-2">{p.category_name}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => {
                      setEditingId(p.id);
                      setForm({
                        name: p.name,
                        description: p.description || "",
                        price: String(p.price),
                        quantity: String(p.quantity),
                        category_id: String(p.category_id),
                      });
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      setStockModal({ productId: p.id, type: "IN" })
                    }
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Add
                  </button>

                  <button
                    onClick={() =>
                      setStockModal({ productId: p.id, type: "OUT" })
                    }
                    className="bg-orange-500 text-white px-3 py-1 rounded"
                  >
                    Remove
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stock Modal */}
      {stockModal.productId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-xl font-bold mb-4">
              {stockModal.type === "IN" ? "Add Stock" : "Remove Stock"}
            </h2>

            <input
              type="number"
              placeholder="Quantity"
              className="border p-2 w-full mb-3"
              value={stockQty}
              onChange={(e) => setStockQty(e.target.value)}
            />

            <input
              type="text"
              placeholder="Note (optional)"
              className="border p-2 w-full mb-4"
              value={stockNote}
              onChange={(e) => setStockNote(e.target.value)}
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() =>
                  setStockModal({ productId: null, type: "IN" })
                }
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleStockSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
