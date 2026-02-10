import type { ReactNode } from "react";
import api from "./client";

export interface Product {
  category_name: ReactNode;
  id: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  category_id: number;
}

export const getProducts = async (): Promise<Product[]> => {
  const token = localStorage.getItem("token");

  const res = await api.get("/products/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const createProduct = async (data: any) => {
  const token = localStorage.getItem("token");

  const res = await api.post("/products/", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const updateProduct = async (id: number, data: any) => {
  const token = localStorage.getItem("token");

  const res = await api.put(`/products/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const deleteProduct = async (id: number) => {
  const token = localStorage.getItem("token");

  await api.delete(`/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
