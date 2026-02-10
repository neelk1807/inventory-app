import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/authUser";

export default function Header() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setUsername(user.username || user.email);
      } catch {
        setUsername("");
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="bg-white shadow p-4 flex justify-end">
      <span className="font-semibold">Hello, {username}</span>
    </div>
  );
}
