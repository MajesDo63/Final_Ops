import '../styles.css'; 
console.log("AdminPage renderizado");

export default function AdminPage() {
  return (
    <div className="main">
      <h1 className="section-title">Panel de Administrador</h1>
      <form onSubmit={addProduct}>
        <input id="productName" type="text" placeholder="Nombre del producto" required />
        <input id="productPrice" type="number" placeholder="Precio" required />
        <input id="productQuantity" type="number" placeholder="Cantidad" required />
        <select id="productCategory" required>
          <option value="recomendados">Recomendados</option>
          <option value="mangas">Mangas</option>
          <option value="comics">Cómics</option>
          <option value="novelas">Novelas</option>
        </select>
        <button type="submit">Agregar producto</button>
      </form>

      <div id="admin-products"></div>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}

// Funciones JS que luego puedes adaptar desde scripts.js
function addProduct(e) {
  e.preventDefault();
  alert('Producto agregado (simulado)');
}

function logout() {
  alert('Sesión cerrada (simulado)');
}
