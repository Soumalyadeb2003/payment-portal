import Header from "./components/Header";
import OrderSummary from "./components/OrderSummary";
import PaymentForm from "./components/PaymentForm";
import Confirmation from "./components/Confirmation";
import { useState } from "react";

function App() {
  const [page, setPage] = useState("payment");
  const [paymentStatus, setPaymentStatus] = useState("success");

  return (
    <div style={{ backgroundColor: "#f3f3f3", minHeight: "100vh" }}>
      <Header />
      {page === "payment" && (
        <>
          <OrderSummary />
          <PaymentForm
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