import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-2xl font-bold mb-4">Contador</h1>
      <div className="p-4 bg-white shadow-md rounded-lg">
        <p className="text-lg mb-4">Valor atual: <span className="font-semibold">{count}</span></p>
        <button 
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Incrementar
        </button>
      </div>
    </div>
  );
}

export default App;
