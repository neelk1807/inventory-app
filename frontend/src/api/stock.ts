import api from "./client";

export interface StockCreate {
  product_id: number;
  type: "IN" | "OUT";
  quantity: number;
  note?: string;
}

export const createStock = async (data: StockCreate) => {
  const token = localStorage.getItem("token");

  const res = await api.post("/stock/", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getStockHistory = async (productId: number) => {
  const token = localStorage.getItem("token");

  const res = await api.get(`/stock/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
