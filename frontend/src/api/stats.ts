import api from "./client";

export const getStats = async () => {
  const token = localStorage.getItem("token");

  const res = await api.get("/stats/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
