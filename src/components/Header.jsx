import { useState } from "react";

export default function Header() {
  const [cartCount, setCartCount] = useState(3);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const user = {
    name: "Soumalya",
    email: "soumalya@email.com",
    avatar: "S",
  };

  return (
    <header
      style={{
        backgroundColor: "#131921",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* ── LOGO ── */}
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span
          style={{
            color: "#ffffff",
            fontSize: "20px",
            fontWeight: "500",
            letterSpacing: "0.5px",
          }}
        >
          Soumalya's
        </span>
        <span
          style={{
            color: "#febd69",
            fontSize: "13px",
            fontWeight: "500",
            letterSpacing: "1px",
          }}
        >
          Payment Portal
        </span>
      </div>

      {/* ── SEARCH BAR ── */}
      <div
        style={{
          flex: 1,
          maxWidth: "600px",
          display: "flex",
          borderRadius: "8px",
          overflow: "hidden",
          border: "2px solid #febd69",
        }}
      >
        <input
          type="text"
          placeholder="Search products..."
          style={{
            flex: 1,
            padding: "8px 14px",
            fontSize: "14px",
            border: "none",
            outline: "none",
            backgroundColor: "#fff",
            color: "#131921",
          }}
        />
        <button
          style={{
            backgroundColor: "#febd69",
            border: "none",
            padding: "0 16px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          🔍
        </button>
      </div>

      {/* ── RIGHT SECTION ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>

        {/* USER INFO with dropdown */}
        <div style={{ position: "relative" }}>
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
            }}
          >
            {/* Avatar circle */}
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#febd69",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "500",
                fontSize: "16px",
                color: "#131921",
              }}
            >
              {user.avatar}
            </div>

            <div style={{ lineHeight: 1.3 }}>
              <p
                style={{
                  color: "#cccccc",
                  fontSize: "11px",
                  margin: 0,
                }}
              >
                Hello,
              </p>
              <p
                style={{
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: "500",
                  margin: 0,
                }}
              >
                {user.name}
              </p>
            </div>

            <span style={{ color: "#ffffff", fontSize: "10px" }}>▼</span>
          </div>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "48px",
                right: 0,
                backgroundColor: "#ffffff",
                border: "1px solid #ddd",
                borderRadius: "8px",
                width: "200px",
                zIndex: 200,
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid #eee",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontWeight: "500",
                    fontSize: "14px",
                    color: "#131921",
                  }}
                >
                  {user.name}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: "#555",
                  }}
                >
                  {user.email}
                </p>
              </div>

              {["My Orders", "My Account", "Wishlist", "Sign Out"].map(
                (item) => (
                  <div
                    key={item}
                    style={{
                      padding: "10px 16px",
                      fontSize: "13px",
                      color: "#131921",
                      cursor: "pointer",
                      borderBottom: "1px solid #f0f0f0",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f3f3f3")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    {item}
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* CART ICON */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            cursor: "pointer",
            position: "relative",
          }}
          onClick={() => alert("Cart opened!")}
        >
          {/* Cart bag icon using CSS */}
          <div style={{ position: "relative", fontSize: "28px" }}>
            🛒
            {/* Badge */}
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-8px",
                  backgroundColor: "#febd69",
                  color: "#131921",
                  borderRadius: "50%",
                  width: "18px",
                  height: "18px",
                  fontSize: "11px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {cartCount}
              </span>
            )}
          </div>

          <span
            style={{
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: "500",
            }}
          >
            Cart
          </span>
        </div>

      </div>
    </header>
  );
}