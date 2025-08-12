declare global {
  interface Window {
    Razorpay: any;
  }
}

const retryPayment = (paymentData: any, onSuccess?: () => void) => {
  if (typeof window.Razorpay === "undefined") {

    // Avoid loading the script multiple times
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => {
        launchRazorpay(paymentData, onSuccess);
      };

      script.onerror = () => {
        alert("Failed to load Razorpay SDK. Please try again later.");
      };

      document.body.appendChild(script);
    } else {
    }
  } else {
    launchRazorpay(paymentData, onSuccess);
  }
};

const launchRazorpay = (razorpayData: any, onSuccess?: () => void) => {
  // Defensive checks
  if (!razorpayData?.RazorpayKey || !razorpayData?.RazorpayOrderId || !razorpayData?.AmountInPaise) {
    return;
  }

  const options = {
    key: razorpayData.RazorpayKey,
    amount: razorpayData.AmountInPaise,
    currency: razorpayData.Currency || "INR",
    order_id: razorpayData.RazorpayOrderId,
    handler: (response: any) => {
      if (onSuccess) onSuccess();
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
  });
};

export default retryPayment;
