import { useEffect, useState } from "react";
import { getCart, removeFromCart } from "../utils/api";
import Swal from "sweetalert2";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    try {
      const res = await getCart();
      setCart(res.data);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch cart", "error");
    }
  }

  async function handleRemove(productId) {
    const confirm = await Swal.fire({
      title: "Remove Product?",
      text: "This product will be removed from your cart",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await removeFromCart(productId);
      await loadCart();
      Swal.fire("Removed!", "Product has been removed from cart.", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to remove product", "error");
    }
  }

  // Hitung total harga
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-primary">
        <i className="bi bi-cart-check me-2"></i> Your Cart
      </h2>
      {cart.length > 0 ? (
        <div className="row g-3">
          {cart.map((item) => (
            <div key={item.id} className="col-md-6 col-lg-4">
              <div className="card shadow-sm h-100 border-0">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-dark">{item.name}</h5>
                  <p className="card-text fw-bold text-success mb-1">
                    Rp {item.price.toLocaleString()}
                  </p>
                  <p className="card-text text-secondary">
                    Qty: {item.quantity}
                  </p>
                  <button
                    className="btn btn-outline-danger mt-auto"
                    onClick={() => handleRemove(item.product_id)}
                  >
                    <i className="bi bi-trash me-1"></i> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-primary text-center">
          <i className="bi bi-bag-x me-2"></i> Your cart is empty
        </div>
      )}

      {/* Total Harga */}
      {cart.length > 0 && (
        <div className="card shadow-sm mt-4 border-0">
          <div className="card-body d-flex justify-content-between align-items-center">
            <h5 className="mb-0 text-dark">Total:</h5>
            <h4 className="text-success mb-0">
              Rp {totalPrice.toLocaleString()}
            </h4>
          </div>
          <div className="card-footer bg-white text-end border-0">
            <button className="btn btn-primary">
              <i className="bi bi-credit-card me-1"></i> Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
