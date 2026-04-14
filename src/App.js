import { useState } from "react";
import Header from "./components/Header";
import OrderSummary from "./components/OrderSummary";
import PaymentForm from "./components/PaymentForm";
import Confirmation from "./components/Confirmation";
import Login from "./components/Login";

function App() {
  const [page, setPage] = useState("login");
  const [paymentStatus, setPaymentStatus] = useState("success");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    setPage("payment");
  };

  return (
    <div style={{ backgroundColor: "#f3f3f3", minHeight: "100vh" }}>
      {page === "login" && (
        <Login onLogin={handleLogin} />
      )}
      {page !== "login" && <Header user={user} />}
      {page === "payment" && (
        <>
          <OrderSummary />
          <PaymentForm
            token={token}
            onSuccess={() => { setPaymentStatus("success"); setPage("confirmation"); }}
            onFailed={() => { setPaymentStatus("failed"); setPage("confirmation"); }}
          />
        </>
      )}
      {page === "confirmation" && (
        <Confirmation status={paymentStatus} amount={3296} paymentMethod="UPI" />
      )}
    </div>
  );
}

export default App;