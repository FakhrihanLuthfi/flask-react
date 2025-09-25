import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <i className="bi bi-bag-check-fill me-2"></i> E-Commerce
        </Link>

        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/" ? "active fw-semibold" : ""
                }`}
                to="/"
              >
                <i className="bi bi-box-seam me-1"></i> Products
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/cart" ? "active fw-semibold" : ""
                }`}
                to="/cart"
              >
                <i className="bi bi-cart-check me-1"></i> Cart
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
