import { useEffect, useState } from "react";
import { getProducts, addProduct, addToCart } from "../utils/api";
import Swal from "sweetalert2";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "" });

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch products", "error");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await addProduct({ name: form.name, price: parseInt(form.price, 10) });
      setForm({ name: "", price: "" });
      await loadProducts();
      Swal.fire("Success", "Product added successfully!", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to add product", "error");
    }
  }

  async function handleAddToCart(id) {
    try {
      await addToCart(id);
      Swal.fire("Success", "Added to cart!", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to add to cart", "error");
    }
  }

  return (
    <div className="container my-4">
      <h2 className="mb-4 fw-bold text-primary">
        <i className="bi bi-box-seam me-2"></i> Products
      </h2>

      {/* Form Tambah Produk */}
      <form onSubmit={handleSubmit} className="row g-3 mb-5">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="col-md-5">
          <input
            type="number"
            className="form-control"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-primary w-100">
            <i className="bi bi-plus-circle me-1"></i> Add
          </button>
        </div>
      </form>

      {/* Daftar Produk */}
      {products.length > 0 ? (
        <div className="row g-4">
          {products.map((p) => (
            <div key={p.id} className="col-md-6 col-lg-4">
              <div className="card shadow-sm border-0 h-100 product-card">
                {/* <img
                  src={`https://via.placeholder.com/400x250.png?text=${p.name}`}
                  className="card-img-top rounded-top"
                  alt={p.name}
                /> */}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text fw-bold text-success mb-2">
                    Rp {p.price.toLocaleString()}
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline-primary mt-auto"
                    onClick={() => handleAddToCart(p.id)}
                  >
                    <i className="bi bi-cart-plus me-1"></i> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-secondary text-center">
          <i className="bi bi-info-circle me-2"></i> No products available
        </div>
      )}

      {/* Custom CSS untuk efek hover */}
      <style>{`
        .product-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}
