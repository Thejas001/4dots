declare global {
  interface Window {
    Razorpay: any;
  }
}

const retryPayment = (paymentData: any) => {
  if (typeof window.Razorpay === "undefined") {
    console.warn("Razorpay SDK not loaded. Trying to load it manually...");

    // Avoid loading the script multiple times
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => {
        console.log("Razorpay SDK loaded successfully.");
        launchRazorpay(paymentData);
      };

      script.onerror = () => {
        alert("Failed to load Razorpay SDK. Please try again later.");
      };

      document.body.appendChild(script);
    } else {
      console.log("Razorpay script is already loading. Please wait...");
    }
  } else {
    launchRazorpay(paymentData);
  }
};

const launchRazorpay = (razorpayData: any) => {
  // Defensive checks
  if (!razorpayData?.RazorpayKey || !razorpayData?.RazorpayOrderId || !razorpayData?.AmountInPaise) {
    console.error("Missing required Razorpay data:", razorpayData);
    alert("Payment details are incomplete. Cannot proceed.");
    return;
  }

  const options = {
    key: razorpayData.RazorpayKey,
    amount: razorpayData.AmountInPaise,
    currency: razorpayData.Currency || "INR",
    order_id: razorpayData.RazorpayOrderId,
    handler: (response: any) => {
      console.log("✅ Payment successful", response);
      // TODO: call your backend API to confirm payment if needed
    },
    prefill: {
      name: "Customer Name", // optional: replace with actual customer name
      email: "customer@example.com" // optional: replace with actual email
    },
    theme: {
      color: "black"
    }
  };

  const rzp = new window.Razorpay(options);
  rzp.open();

  rzp.on("payment.failed", function (response: any) {
    console.error("❌ Payment failed", response);
    alert("Payment failed. Please try again.");
  });
};

export default retryPayment;
