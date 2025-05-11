import React, { useEffect, useState } from 'react';

export default function IndexPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error al cargar productos:", err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Catálogo de Productos</h1>
      {products.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <ul>
          {products.map(p => (
            <li key={p.id}>
              <strong>{p.name}</strong> — ${p.price} — {p.category} (x{p.quantity})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
