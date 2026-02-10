import api from "./client";

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");

  const res = await api.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
