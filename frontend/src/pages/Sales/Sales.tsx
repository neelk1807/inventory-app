import { useEffect, useState } from "react";
import { getProducts } from "../../api/products";
import { createOrder } from "../../api/order";
import api from "../../api/client";

export default function Sales() {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const addToCart = (product: any) => {
    const existing = cart.find((c) => c.id === product.id);

    if (existing) {
      setCart(
        cart.map((c) =>
          c.id === product.id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
  try {
    const payload = {
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    };

    // create order
    const orderRes = await api.post("/orders/", payload);
    const orderId = orderRes.data.id;

    // request invoice as blob
    const pdfRes = await api.get(`/orders/${orderId}/invoice`, {
      responseType: "blob",
    });

    // create download link
    const url = window.URL.createObjectURL(new Blob([pdfRes.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `invoice_${orderId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    setCart([]);
    loadProducts();
  } catch (err: any) {
    console.error(err);
    alert(err.response?.data?.detail || "Checkout failed");
  }
};

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Products */}
      <div>
        <h1 className="text-xl font-bold mb-4">Products</h1>
        <div className="grid grid-cols-2 gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="border p-4 rounded cursor-pointer"
              onClick={() => addToCart(p)}
            >
              <h3 className="font-bold">{p.name}</h3>
              <p>${p.price}</p>
              <p className="text-sm text-gray-500">
                Stock: {p.quantity}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div>
        <h1 className="text-xl font-bold mb-4">Cart</h1>

        <div className="bg-white p-4 rounded shadow">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between border-b py-2"
            >
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>
                ${item.price * item.quantity}
              </span>
            </div>
          ))}

          <div className="flex justify-between font-bold mt-4">
            <span>Total</span>
            <span>${total}</span>
          </div>

          <button
            onClick={handleCheckout}
            className="bg-blue-600 text-white w-full py-2 mt-4 rounded"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
