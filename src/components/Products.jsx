import { useState, useEffect } from "react";

const BACKEND = "https://payment-backend-production-a82f.up.railway.app";

export default function Products({ onProceed, onCartUpdate }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const categories = [
    "All", "Electronics", "Accessories", "Gaming", "Clothing",
    "Sports", "Home", "Beauty", "Health", "Books", "Stationery",
    "Toys", "Garden", "Photography", "Wearables"
  ];

  useEffect(() => {
    fetch(`${BACKEND}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    if (onCartUpdate) onCartUpdate(totalItems);
  }, [cart]);

  const addToCart = (productId) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[productId] > 1) {
        updated[productId] -= 1;
      } else {
        delete updated[productId];
      }
      return updated;
    });
  };

  const getTotalItems = () =>
    Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const getTotalPrice = () =>
    products
      .filter((p) => cart[p.id])
      .reduce((sum, p) => sum + p.price * cart[p.id], 0);

  const getCartItems = () =>
    products
      .filter((p) => cart[p.id])
      .map((p) => ({ ...p, qty: cart[p.id] }));

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleProceed = () => {
    if (getTotalItems() === 0) {
      alert("Please add at least one item to cart!");
      return;
    }
    onProceed(getCartItems(), getTotalPrice());
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "18px",
        color: "#131921",
      }}>
        Loading products...
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f3f3f3", minHeight: "100vh" }}>

      {/* Search and Filter Bar */}
      <div style={{
        backgroundColor: "#131921",
        padding: "12px 20px",
        display: "flex",
        gap: "12px",
        alignItems: "center",
        flexWrap: "wrap",
      }}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            fontSize: "14px",
            outline: "none",
            minWidth: "200px",
          }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            border: "none",
            fontSize: "14px",
            outline: "none",
            backgroundColor: "#fff",
            color: "#131921",
          }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Category pills */}
      <div style={{
        display: "flex",
        gap: "8px",
        padding: "12px 20px",
        overflowX: "auto",
        backgroundColor: "#fff",
        borderBottom: "1px solid #e0e0e0",
      }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              padding: "6px 16px",
              borderRadius: "20px",
              border: category === cat ? "none" : "1px solid #ccc",
              backgroundColor: category === cat ? "#febd69" : "#fff",
              color: "#131921",
              fontSize: "13px",
              fontWeight: category === cat ? "500" : "400",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div style={{
        padding: "12px 20px",
        fontSize: "14px",
        color: "#555",
      }}>
        Showing {filteredProducts.length} products
        {category !== "All" && ` in ${category}`}
        {search && ` for "${search}"`}
      </div>

      {/* Products Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "16px",
        padding: "0 20px 100px",
      }}>
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              border: "1px solid #e0e0e0",
              overflow: "hidden",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            {/* Product Image */}
            <div style={{ position: "relative" }}>
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300";
                }}
              />
              {/* Category badge */}
              <span style={{
                position: "absolute",
                top: "8px",
                left: "8px",
                backgroundColor: "#131921",
                color: "#febd69",
                fontSize: "11px",
                padding: "3px 8px",
                borderRadius: "12px",
                fontWeight: "500",
              }}>
                {product.category}
              </span>
            </div>

            {/* Product Info */}
            <div style={{ padding: "12px" }}>
              <p style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#131921",
                margin: "0 0 4px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {product.name}
              </p>
              <p style={{
                fontSize: "16px",
                fontWeight: "500",
                color: "#B12704",
                margin: "0 0 12px",
              }}>
                ₹{product.price.toLocaleString()}
              </p>

              {/* Add to Cart Pill */}
              {!cart[product.id] ? (
                <button
                  onClick={() => addToCart(product.id)}
                  style={{
                    width: "100%",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    border: "none",
                    backgroundColor: "#febd69",
                    color: "#131921",
                    fontSize: "13px",
                    fontWeight: "500",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <span style={{ fontSize: "16px" }}>🛒</span>
                  Add to Cart
                </button>
              ) : (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#131921",
                  borderRadius: "20px",
                  padding: "4px 8px",
                }}>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      border: "none",
                      backgroundColor: "#febd69",
                      color: "#131921",
                      fontSize: "18px",
                      fontWeight: "500",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    −
                  </button>
                  <span style={{
                    color: "#ffffff",
                    fontWeight: "500",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}>
                    <span style={{ fontSize: "14px" }}>🛒</span>
                    {cart[product.id]}
                  </span>
                  <button
                    onClick={() => addToCart(product.id)}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      border: "none",
                      backgroundColor: "#febd69",
                      color: "#131921",
                      fontSize: "18px",
                      fontWeight: "500",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky bottom cart bar */}
      {getTotalItems() > 0 && (
        <div style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#131921",
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 1000,
        }}>
          <div style={{ color: "#ffffff" }}>
            <p style={{ margin: 0, fontSize: "13px", color: "#febd69" }}>
              {getTotalItems()} items in cart
            </p>
            <p style={{ margin: 0, fontSize: "18px", fontWeight: "500" }}>
              ₹{getTotalPrice().toLocaleString()}
            </p>
          </div>
          <button
            onClick={handleProceed}
            style={{
              padding: "12px 32px",
              backgroundColor: "#febd69",
              border: "none",
              borderRadius: "24px",
              fontSize: "15px",
              fontWeight: "500",
              color: "#131921",
              cursor: "pointer",
            }}
          >
            Proceed to Payment →
          </button>
        </div>
      )}
    </div>
  );
}