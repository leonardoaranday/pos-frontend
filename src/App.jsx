import { useState, useEffect } from 'react';
import axios from 'axios';

export default function app() {
  const [productos, setproductos] = useState([]);
  const [carrito, setcarrito] = useState([]);
  const [total, settotal] = useState(0);

  useEffect(() => {
    axios.get('https://api-punto-venta-lz5t.onrender.com/api/productos')
      .then(res => setproductos(res.data))
      .catch(() => {});
  }, []);

  const agregarticket = (prod) => {
    setcarrito([...carrito, prod]);
    settotal(total + prod.precio);
  };

  const procesarcobro = async () => {
    if (carrito.length === 0) return;
    try {
      const articulos = carrito.map(item => ({ producto: item._id, cantidad: 1, precio: item.precio }));
      await axios.post('https://api-punto-venta-lz5t.onrender.com/api/venta', { articulos, total });
      setcarrito([]);
      settotal(0);
      alert('cobro exitoso. base de datos actualizada.');
    } catch (e) {
      alert('error al procesar cobro');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-2/3 p-4">
        <h1 className="text-2xl font-bold mb-4">productos</h1>
        <div className="grid grid-cols-3 gap-4">
          {productos.map(p => (
            <div key={p._id} onClick={() => agregarticket(p)} className="bg-white p-4 rounded shadow text-center cursor-pointer hover:bg-gray-50 transition-all">
              <p>{p.nombre}</p>
              <p className="font-bold text-blue-600">${p.precio}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-1/3 bg-white p-4 border-l flex flex-col shadow-lg">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">boleto de cobro</h2>
        <div className="flex-grow overflow-y-auto">
          {carrito.map((item, index) => (
            <div key={index} className="flex justify-between mb-2 p-2 border-b text-sm">
              <span>{item.nombre}</span>
              <span>${item.precio}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-4 mt-auto">
          <p className="text-2xl font-bold mb-4">total: ${total}</p>
          <button onClick={procesarcobro} className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition-colors">
            cobrar
          </button>
        </div>
      </div>
    </div>
  );
}