import api from "./client";

export async function getCategories() {
  const res = await api.get("/categories/");
  return res.data;
}

export async function createCategory(name: string) {
  const res = await api.post("/categories/", { name });
  return res.data;
}

export const deleteCategory = async (id: number) => {
  const token = localStorage.getItem("token");

  await api.delete(`/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateCategory = async (id: number, data: any) => {
  const token = localStorage.getItem("token");

  const res = await api.put(`/categories/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
