import api from "./client";

export interface UserCreate {
  username: string;  
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const registerUser = async (data: UserCreate) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (data: LoginData) => {
  const formData = new URLSearchParams();
  formData.append("username", data.email);
  formData.append("password", data.password);

  const res = await api.post("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return res.data;
};
