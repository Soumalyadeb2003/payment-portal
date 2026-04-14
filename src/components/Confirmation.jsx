import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";

export default function Confirmation() {
  const [msg, setMsg] = useState("Sending email...");

  useEffect(() => {
    emailjs.init("GCEoiFrPSyTHLFQk7");
    
    emailjs.send(
      "service_v6cfogn",
      "template_juryro3",
      {
        to_name: "Soumalya",
        to_email: "soumalyadebban.slsn12abc@gmail.com",
        amount: "3296",
        status: "SUCCESSFUL",
        order_id: "ORD123456",
        payment_method: "UPI",
        date: new Date().toLocaleString("en-IN"),
        phone: "9163254102",
      }
    ).then(() => {
      console.log("EMAIL SENT SUCCESS!");
      setMsg("Email sent successfully!");
    }).catch((err) => {
      console.log("EMAIL ERROR:", err);
      setMsg("Email error: " + JSON.stringify(err));
    });
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: "60px", marginBottom: "20px" }}>✅</div>
      <h2 style={{ color: "#1a7340" }}>Payment Successful!</h2>
      <p style={{ color: "#555" }}>Thank you, Soumalya!</p>
      <p style={{ 
        marginTop: "20px", 
        padding: "12px", 
        backgroundColor: "#f0f0f0", 
        borderRadius: "8px",
        fontSize: "14px"
      }}>
        {msg}
      </p>
    </div>
  );
}