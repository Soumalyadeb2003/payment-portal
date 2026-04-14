import { useState } from "react";

export default function PaymentForm({ onSuccess, onFailed }) {
  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [wallet, setWallet] = useState("");
  const [bank, setBank] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");   // ← ADD THIS LINE

  const validCoupon = "SOUMALYA20";
  const discount = couponApplied ? 200 : 0;
  const totalAmount = 3296 - discount;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === validCoupon) {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponApplied(false);
      setCouponError("Invalid coupon code. Try SOUMALYA20");
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setError("");
  
    try {
      const token = localStorage.getItem("token");
  
      const orderRes = await fetch(
        "https://payment-backend-production-a82f.up.railway.app/api/orders/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: [
              { name: "Wireless Headphones", price: 1999, qty: 1 },
              { name: "Phone Case", price: 499, qty: 2 },
              { name: "USB Cable", price: 299, qty: 1 },
            ],
            totalAmount: totalAmount,
            paymentMethod: method,
          }),
        }
      );
  
      const orderData = await orderRes.json();
  
      if (!orderRes.ok) {
        setError(orderData.message || "Failed to create order!");
        setLoading(false);
        return;
      }
  
      const orderId = orderData.order._id;
  
      const paymentRes = await fetch(
        "https://payment-backend-production-a82f.up.railway.app/api/payments/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: totalAmount,
            orderId: orderId,
          }),
        }
      );
  
      const paymentData = await paymentRes.json();
  
      const options = {
        key: paymentData.keyId || "rzp_test_SdNZt9C5Aso0Yb",
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: "Soumalya's Payment Portal",
        description: "Order Payment",
        order_id: paymentData.razorpayOrderId,
        handler: async (response) => {
          const verifyRes = await fetch(
            "https://payment-backend-production-a82f.up.railway.app/api/payments/verify",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderId: orderId,
              }),
            }
          );
  
          const verifyData = await verifyRes.json();
  
          if (verifyData.success) {
            setLoading(false);
            if (onSuccess) onSuccess();
          } else {
            setError("Payment verification failed!");
            setLoading(false);
            if (onFailed) onFailed();
          }
        },
        prefill: {
          name: "Soumalya",
          email: "soumalyadebban.slsn12abc@gmail.com",
          contact: "9163254102",
        },
        theme: {
          color: "#febd69",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError("Payment cancelled!");
          },
        },
      };
  
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
  
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const methods = [
    { id: "upi", label: "UPI", icon: "💳" },
    { id: "wallet", label: "Wallet", icon: "👜" },
    { id: "netbanking", label: "Net Banking", icon: "🏦" },
    { id: "credit", label: "Credit Card", icon: "💰" },
    { id: "debit", label: "Debit Card", icon: "🏧" },
    { id: "cod", label: "Cash on Delivery", icon: "📦" },
  ];

  if (success) {
    return (
      <div
        style={{
          maxWidth: "600px",
          margin: "40px auto",
          padding: "40px 20px",
          textAlign: "center",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e0e0e0",
        }}
      >
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>✅</div>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "500",
            color: "#131921",
            marginBottom: "8px",
          }}
        >
          Payment Successful!
        </h2>
        <p style={{ color: "#555", fontSize: "15px" }}>
          Thank you, Soumalya! Your order has been placed.
        </p>
        <p
          style={{
            marginTop: "16px",
            fontSize: "18px",
            fontWeight: "500",
            color: "#131921",
          }}
        >
          Amount Paid: ₹{totalAmount.toLocaleString()}
        </p>
        <button
          onClick={() => setSuccess(false)}
          style={{
            marginTop: "24px",
            padding: "12px 32px",
            backgroundColor: "#febd69",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: "500",
            color: "#131921",
            cursor: "pointer",
          }}
        >
          Back to Payment
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "30px auto",
        padding: "0 16px 40px",
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
        Select Payment Method
      </h2>

      {/* Payment method selector */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
          marginBottom: "24px",
        }}
      >
        {methods.map((m) => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            style={{
              padding: "12px 8px",
              borderRadius: "10px",
              border:
                method === m.id
                  ? "2px solid #febd69"
                  : "1px solid #e0e0e0",
              backgroundColor:
                method === m.id ? "#fffbf0" : "#ffffff",
              cursor: "pointer",
              textAlign: "center",
              transition: "all 0.2s",
            }}
          >
            <div style={{ fontSize: "22px", marginBottom: "4px" }}>
              {m.icon}
            </div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: "500",
                color: method === m.id ? "#131921" : "#555",
              }}
            >
              {m.label}
            </div>
          </button>
        ))}
      </div>

      {/* UPI */}
      {method === "upi" && (
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e0e0e0",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              fontWeight: "500",
              fontSize: "15px",
              marginBottom: "12px",
              color: "#131921",
            }}
          >
            Enter your UPI ID
          </p>
          <input
            type="text"
            placeholder="example@upi"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "16px",
              flexWrap: "wrap",
            }}
          >
            {["GPay", "PhonePe", "Paytm", "BHIM"].map((app) => (
              <button
                key={app}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                  backgroundColor: "#f9f9f9",
                  fontSize: "13px",
                  cursor: "pointer",
                  color: "#131921",
                }}
              >
                {app}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Wallet */}
      {method === "wallet" && (
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e0e0e0",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              fontWeight: "500",
              fontSize: "15px",
              marginBottom: "12px",
              color: "#131921",
            }}
          >
            Select Wallet
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {["Paytm Wallet", "Amazon Pay", "Mobikwik", "Freecharge"].map(
              (w) => (
                <label
                  key={w}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 14px",
                    border:
                      wallet === w
                        ? "1.5px solid #febd69"
                        : "1px solid #e0e0e0",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: wallet === w ? "#fffbf0" : "#fff",
                  }}
                >
                  <input
                    type="radio"
                    name="wallet"
                    value={w}
                    checked={wallet === w}
                    onChange={() => setWallet(w)}
                  />
                  <span style={{ fontSize: "14px", color: "#131921" }}>
                    {w}
                  </span>
                </label>
              )
            )}
          </div>
        </div>
      )}

      {/* Net Banking */}
      {method === "netbanking" && (
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e0e0e0",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              fontWeight: "500",
              fontSize: "15px",
              marginBottom: "12px",
              color: "#131921",
            }}
          >
            Select Your Bank
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "10px",
              marginBottom: "14px",
            }}
          >
            {["SBI", "HDFC", "ICICI", "Axis Bank"].map((b) => (
              <button
                key={b}
                onClick={() => setBank(b)}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border:
                    bank === b
                      ? "2px solid #febd69"
                      : "1px solid #e0e0e0",
                  backgroundColor: bank === b ? "#fffbf0" : "#f9f9f9",
                  fontSize: "13px",
                  fontWeight: "500",
                  cursor: "pointer",
                  color: "#131921",
                }}
              >
                {b}
              </button>
            ))}
          </div>
          <select
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
              color: "#131921",
              outline: "none",
              boxSizing: "border-box",
            }}
          >
            <option value="">-- Other Banks --</option>
            {[
              "Kotak Mahindra",
              "Yes Bank",
              "Punjab National Bank",
              "Bank of Baroda",
              "Canara Bank",
              "IndusInd Bank",
            ].map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Credit Card & Debit Card */}
      {(method === "credit" || method === "debit") && (
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e0e0e0",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              fontWeight: "500",
              fontSize: "15px",
              marginBottom: "16px",
              color: "#131921",
            }}
          >
            {method === "credit" ? "Credit" : "Debit"} Card Details
          </p>

          <div
            style={{
              backgroundColor: "#131921",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "20px",
              color: "#fff",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                color: "#febd69",
                margin: "0 0 16px",
              }}
            >
              Soumalya's Payment Portal
            </p>
            <p
              style={{
                fontSize: "18px",
                letterSpacing: "3px",
                margin: "0 0 16px",
                fontFamily: "monospace",
              }}
            >
              {cardNumber
                ? cardNumber.replace(/(.{4})/g, "$1 ").trim()
                : "XXXX XXXX XXXX XXXX"}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "13px",
              }}
            >
              <span>{cardName || "CARD HOLDER NAME"}</span>
              <span>{expiry || "MM/YY"}</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
              type="text"
              placeholder="Name on card"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <input
              type="text"
              placeholder="Card number (16 digits)"
              maxLength={16}
              value={cardNumber}
              onChange={(e) =>
                setCardNumber(e.target.value.replace(/\D/g, ""))
              }
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <div style={{ display: "flex", gap: "12px" }}>
              <input
                type="text"
                placeholder="MM/YY"
                maxLength={5}
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              <input
                type="password"
                placeholder="CVV"
                maxLength={3}
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Cash on Delivery */}
      {method === "cod" && (
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e0e0e0",
            borderRadius: "10px",
            padding: "24px 20px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📦</div>
          <p
            style={{
              fontWeight: "500",
              fontSize: "16px",
              color: "#131921",
              marginBottom: "8px",
            }}
          >
            Cash on Delivery selected
          </p>
          <p style={{ fontSize: "13px", color: "#555" }}>
            Please keep exact change ready at the time of delivery. COD
            charges of ₹40 may apply.
          </p>
        </div>
      )}

      {/* Coupon Section */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e0e0e0",
          borderRadius: "10px",
          padding: "16px 20px",
          marginBottom: "20px",
        }}
      >
        <p
          style={{
            fontWeight: "500",
            fontSize: "15px",
            marginBottom: "12px",
            color: "#131921",
          }}
        >
          Apply Coupon
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Enter coupon code"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
              outline: "none",
            }}
          />
          <button
            onClick={applyCoupon}
            style={{
              padding: "10px 18px",
              backgroundColor: "#131921",
              color: "#febd69",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Apply
          </button>
        </div>
        {couponApplied && (
          <p
            style={{
              marginTop: "8px",
              fontSize: "13px",
              color: "green",
              fontWeight: "500",
            }}
          >
            Coupon applied! You save ₹200
          </p>
        )}
        {couponError && (
          <p
            style={{ marginTop: "8px", fontSize: "13px", color: "red" }}
          >
            {couponError}
          </p>
        )}
      </div>

      {/* Total Summary */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e0e0e0",
          borderRadius: "10px",
          padding: "16px 20px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "14px",
            color: "#555",
            marginBottom: "8px",
          }}
        >
          <span>Order Total</span>
          <span>₹3,296</span>
        </div>
        {couponApplied && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "14px",
              color: "green",
              marginBottom: "8px",
            }}
          >
            <span>Coupon Discount</span>
            <span>− ₹200</span>
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "17px",
            fontWeight: "500",
            color: "#131921",
            borderTop: "1px solid #e0e0e0",
            paddingTop: "12px",
            marginTop: "8px",
          }}
        >
          <span>Amount to Pay</span>
          <span>₹{totalAmount.toLocaleString()}</span>
        </div>
      </div>

      {/* Pay Button */}
      <button
        onClick={handlePayment}
        disabled={loading}
        style={{
          width: "100%",
          padding: "15px",
          backgroundColor: loading ? "#ccc" : "#febd69",
          border: "none",
          borderRadius: "10px",
          fontSize: "17px",
          fontWeight: "500",
          color: "#131921",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Processing payment..." : `Pay ₹${totalAmount.toLocaleString()}`}
      </button>

      <p
        style={{
          textAlign: "center",
          fontSize: "12px",
          color: "#888",
          marginTop: "14px",
        }}
      >
        🔒 Your payment is 100% secure and encrypted
      </p>
    </div>
  );
}