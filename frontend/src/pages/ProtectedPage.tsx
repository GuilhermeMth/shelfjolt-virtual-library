import { useEffect, useState } from "react";
import { getProtectedData } from "../services/protected.service";

export default function ProtectedPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProtectedData()
      .then((res) => setData(res.data))
      .catch((err) =>
        setError(err.message || "Erro ao acessar rota protegida"),
      );
  }, []);

  if (error) return <div className="text-red-600">{error}</div>;
  if (!data) return <div>Carregando...</div>;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Acesso autorizado!</h2>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
