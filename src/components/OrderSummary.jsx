import { useState } from "react";

export default function OrderSummary() {
  const [items, setItems] = useState([
    { id: 1, name: "Wireless Headphones", price: 1999, qty: 1, img: "🎧" },
    { id: 2, name: "Phone Case", price: 499, qty: 2, img: "📱" },
    { id: 3, name: "USB Cable", price: 299, qty: 1, img: "🔌" },
  ]);

  const updateQty = (id, change) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty + change } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const delivery = 40;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + delivery + tax;

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "30px auto",
        padding: "0 16px",
      }}
    >
      {/* Heading */}
      <h2
        style={{
          fontSize: "22px",
          fontWeight: "500",
          color: "#131921",
          marginBottom: "16px",
          borderBottom: "1px solid #e0e0e0",
          paddingBottom: "10px",
        }}
      >
        Order Summary
      </h2>

      {/* Item list */}
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#ffffff",
            border: "1px solid #e0e0e0",
            borderRadius: "10px",
            padding: "14px 16px",
            marginBottom: "12px",
          }}
        >
          {/* Left: icon + name */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                fontSize: "32px",
                backgroundColor: "#f3f3f3",
                borderRadius: "8px",
                width: "52px",
                height: "52px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {item.img}
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  fontWeight: "500",
                  fontSize: "15px",
                  color: "#131921",
                }}
              >
                {item.name}
              </p>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "13px",
                  color: "#555",
                }}
              >
                ₹{item.price.toLocaleString()} each
              </p>
            </div>
          </div>

          {/* Right: qty controls + price */}
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                margin: "0 0 8px",
                fontWeight: "500",
                fontSize: "15px",
                color: "#131921",
              }}
            >
              ₹{(item.price * item.qty).toLocaleString()}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => updateQty(item.id, -1)}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  backgroundColor: "#f3f3f3",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "#131921",
                }}
              >
                −
              </button>
              <span style={{ fontSize: "14px", fontWeight: "500" }}>
                {item.qty}
              </span>
              <button
                onClick={() => updateQty(item.id, 1)}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  backgroundColor: "#f3f3f3",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "#131921",
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Price breakdown */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e0e0e0",
          borderRadius: "10px",
          padding: "16px",
          marginTop: "8px",
        }}
      >
        {[
          { label: "Subtotal", value: subtotal },
          { label: "Delivery charge", value: delivery },
          { label: "GST (18%)", value: tax },
        ].map((row) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "14px",
              color: "#555",
              marginBottom: "10px",
            }}
          >
            <span>{row.label}</span>
            <span>₹{row.value.toLocaleString()}</span>
          </div>
        ))}

        {/* Divider */}
        <div
          style={{
            borderTop: "1px solid #e0e0e0",
            marginTop: "8px",
            paddingTop: "12px",
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "500",
            fontSize: "17px",
            color: "#131921",
          }}
        >
          <span>Total</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
      </div>

      {/* Proceed button */}
      <button
        style={{
          width: "100%",
          marginTop: "20px",
          padding: "14px",
          backgroundColor: "#febd69",
          border: "none",
          borderRadius: "10px",
          fontSize: "16px",
          fontWeight: "500",
          color: "#131921",
          cursor: "pointer",
        }}
        onClick={() => alert("Proceeding to payment...")}
      >
        Proceed to Payment
      </button>
    </div>
  );
}