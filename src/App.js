import { useState } from "react";
import Header from "./components/Header";
import Login from "./components/Login";
import Products from "./components/Products";
import OrderSummary from "./components/OrderSummary";
import PaymentForm from "./components/PaymentForm";
import Confirmation from "./components/Confirmation";

function App() {
  const [page, setPage] = useState("login");
  const [paymentStatus, setPaymentStatus] = useState("success");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    setPage("products");
  };

  const handleProceed = (items, total) => {
    setCartItems(items);
    setTotalAmount(total);
    setPage("payment");
  };

  return (
    <div style={{ backgroundColor: "#f3f3f3", minHeight: "100vh" }}>
      {page === "login" && (
        <Login onLogin={handleLogin} />
      )}

      {page !== "login" && (
        <Header user={user} cartCount={cartCount} />
      )}

      {page === "products" && (
        <Products
          onProceed={handleProceed}
          onCartUpdate={setCartCount}
        />
      )}

      {page === "payment" && (
        <>
          <OrderSummary items={cartItems} totalAmount={totalAmount} />
          <PaymentForm
            token={token}
            cartItems={cartItems}
            totalAmount={totalAmount}
            onSuccess={() => { setPaymentStatus("success"); setPage("confirmation"); }}
            onFailed={() => { setPaymentStatus("failed"); setPage("confirmation"); }}
          />
        </>
      )}

      {page === "confirmation" && (
        <Confirmation
          status={paymentStatus}
          amount={totalAmount}
          paymentMethod="UPI"
        />
      )}
    </div>
  );
}

export default App;