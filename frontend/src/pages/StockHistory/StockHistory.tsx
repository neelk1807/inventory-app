import { useEffect, useState } from "react";
import { getStockHistory } from "../../api/stock";

interface Props {
  productId: number;
}

export default function StockHistory({ productId }: Props) {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await getStockHistory(productId);
      setHistory(data);
    };
    load();
  }, [productId]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Stock History</h2>
      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Type</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Note</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h) => (
            <tr key={h.id} className="border-t">
              <td className="p-2">{h.type}</td>
              <td className="p-2">{h.quantity}</td>
              <td className="p-2">{h.note}</td>
              <td className="p-2">
                {new Date(h.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
