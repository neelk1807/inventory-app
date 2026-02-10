import { useEffect, useState } from "react";
import api from "../../api/client";
import { deleteCategory, updateCategory } from "../../api/categories";

interface Category {
  id: number;
  name: string;
  description?: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchCategories = async () => {
    const res = await api.get("/categories/");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (error) {
      alert("You are not allowed to delete this Category");
    }
  };

  const addOrUpdateCategory = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    if (editingId) {
      await updateCategory(editingId, { name, description });
      setEditingId(null);
    } else {
      await api.post("/categories/", { name, description });
    }

    setName("");
    setDescription("");
    fetchCategories();
  } catch (err: any) {
    alert(err.response?.data?.detail || "Error");
  }
};

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Categories</h1>

      <form
        onSubmit={addOrUpdateCategory}
        className="bg-white p-4 rounded shadow mb-6"
      >
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Category name"
            className="border p-2 flex-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Description"
            className="border p-2 flex-1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button className="bg-blue-600 text-white px-4 rounded">
            Add
          </button>
        </div>
      </form>

      <div className="bg-white rounded shadow">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Description</th>
               <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-t">
                <td className="p-2">{cat.name}</td>
                <td className="p-2">{cat.description}</td>
                <td className="p-2">
                    <button
  onClick={() => {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description || "");
  }}
  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
>
  Edit
</button>
    <button
      onClick={() => handleDelete(cat.id)}
      className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
    >
      Delete
    </button>
  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}