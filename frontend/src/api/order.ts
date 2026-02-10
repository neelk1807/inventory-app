import api from "./client";

export const createOrder = async (items: any[]) => {
  const res = await api.post("/orders/", { items });
  return res.data; // returns order object
};
