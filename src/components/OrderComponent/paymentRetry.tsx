 declare global {
  interface Window {
    Razorpay: any;
  }
}
 
const retryPayment = (paymentData: any) => {
  if (typeof window.Razorpay === "undefined") {
    console.error("Razorpay SDK not loaded. Trying to load it manually...");

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      launchRazorpay(paymentData); // Pass the data here
    };

    script.onerror = () => {
      alert("Failed to load Razorpay SDK");
    };

    document.body.appendChild(script);
  } else {
    launchRazorpay(paymentData); // Pass the data here too
  }
};

const launchRazorpay = (razorpayData: any) => {
  const options = {
    key: razorpayData.key,
    amount: razorpayData.amount,
    currency: razorpayData.currency,
    order_id: razorpayData.razorpayOrderId,
    handler: (response: any) => {
      console.log("Payment successful", response);
    },
    prefill: {
      name: "Customer Name",
      email: "customer@example.com"
    }
  };

  const rzp = new window.Razorpay(options);
  rzp.open();

  rzp.on("payment.failed", function (response: any) {
    console.error("Payment failed", response);
    alert("Payment failed. Please try again.");
  });
};

export default retryPayment;