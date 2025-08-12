"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa"; // Using FontAwesome React icons
import { sendOtp , verifyOTP } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Loader from "../common/Loader";
import toast from "react-hot-toast";

interface OTPInputComponentProps {
  onLoginSuccess?: () => void;
}

function OTPInputComponent({ onLoginSuccess }: OTPInputComponentProps = {}) {
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(240); // Timer in seconds (4 minutes)
  const [loading, setLoading] = useState(false); // Loader for API calls
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";



  const handleSendOtpClick = async () => {
    // Regular expression to validate phone number (10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(phoneNumber)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

   try {
      setLoading(true);
      const response = await sendOtp(phoneNumber); // 🔹 API call to send OTP
      if (response){
        setError("");
        setShowOTP(true);
        setTimeLeft(240); // Reset timer
      }
      else{
        setError("Failed to send OTP. Please try later.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP. Please try later.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = async () => {
    try {
      setLoading(true);
      setError("");
      const otpString = otp.join(""); // Ensure the OTP array is joined into a string

      // Verify OTP API call
      const token = await verifyOTP(phoneNumber, otpString);
      
      if(!token){
        throw new Error("Invalid Otp");
      }
      
      // Set JWT token in cookies 
      document.cookie = `jwtToken=${token}; path=/; max-age=604800; SameSite=Lax; Secure`;

      // Store JWT token in localStorage (or you can use sessionStorage)
      localStorage.setItem("jwtToken", token);


      // Dispatch custom event for login success
      window.dispatchEvent(new CustomEvent("userLoggedIn", { detail: { token } }));

      // Show success message
      toast.success("Login successful!");

      // Call the callback if provided, otherwise redirect
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        // Fallback to redirect if no callback provided
        router.push(redirectPath);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err)); // Handle OTP verification errors
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;
    if (showOTP && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(timer); // Cleanup on unmount or when timeLeft changes
  }, [showOTP, timeLeft]);

  const handleOtpChange = (value: string | any[], index: number) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value.slice(0, 1); // Ensure only one digit per input
    setOtp(updatedOtp);

    // Automatically focus the next input if the value is not empty and if not the last input
    if (value && index < 6) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move focus to the previous input on backspace if current field is empty
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      // Move focus to the next input on right arrow key
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      // Move focus to the previous input on left arrow key
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  {/**Resend Otp*/}
  const handleResendOtp = async () => {
    if (timeLeft === 0) {
      try{
        setLoading(true);
        setError("");
        setOtp(Array(6).fill("")); // Clear the OTP input fields

        const response = await sendOtp(phoneNumber); // 🔹 API call to resend OTP
        if (response){
          setShowOTP(true);
          setTimeLeft(240); // Reset the timer
        }
        else{
          setError("Failed to resend OTP. Please try later.");
        }
      }
      catch (err) {
        setError(err instanceof Error ? err.message : "Failed to resend OTP. Please try later.");
      } finally {
        setLoading(false);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <>
      {/* Initial text input field */}
      {!showOTP && (
        <div className="flex w-full flex-col items-center">
          <div className=" w-full max-w-sm ">
            <label className="mb-2 block font-medium text-gray-700">
              Phone Number
            </label>
            <div className="flex items-center overflow-hidden rounded-lg border border-gray-300 bg-white">
              <div className="flex items-center px-4">
               {/** */} <img
                  src={"/images/login/flag-india.svg"}
                  alt={"Flag"}
                  className="mr-2"
                />
                <span className="mr-1 font-medium text-gray-400">|</span>
                <span className="font-medium text-gray-400">+91</span>
              </div>
              <input
                type="text"
                placeholder=""
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={`flex-1 p-3 outline-none ${
                  error
                    ? "border-red-500"
                    : "border-gray-300 focus:ring focus:ring-blue-300"
                }`}
              />
            </div>
          </div>

          <button
            onClick={handleSendOtpClick}
            disabled={loading} // Disable button when loading
            className={`mt-14 w-full max-w-sm rounded-full py-3 text-center font-medium text-white shadow-lg transition duration-300 ${
              loading
                ? "bg-gray-500 cursor-not-allowed" // Disabled style
                : "bg-[rgb(36,36,36)] hover:bg-gray-800"
              }`}
            >
              {loading ? "Sending OTP..." : "Send OTP"} {/* Dynamic text change */}
            </button>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
      )}

      {/* OTP input fields */}
      {showOTP && (
        <>
          <div className="flex flex-col items-start w-full">
            <label className="mb-2 block font-medium text-gray-700">OTP</label>
            <div className="flex gap-2 sm:gap-3 w-full justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg border border-gray-300 text-center text-base sm:text-lg focus:outline-none focus:ring focus:ring-blue-300 flex-shrink-0"
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Display the entered OTP */}
      {showOTP && (
        <>
          <label className="my-2 block font-medium text-blue-500">
            {formatTime(timeLeft)}
          </label>
          <EditableLabel phoneNumber={phoneNumber} setShowOTP={setShowOTP} />

          <button
            onClick={handleResendOtp}
            disabled={timeLeft > 0}
            className={`my-2 block text-blue-500 underline ${timeLeft > 0 ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
          >
            Resend OTP
          </button>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          <button
            disabled={loading}
            onClick={handleLoginClick}
            className="mt-4 w-full max-w-sm rounded-full bg-[rgb(36,36,36)] py-3 text-center font-medium text-white shadow-lg transition duration-300 hover:bg-gray-800 cursor-pointer"
          >
            {loading ? "Verifying..." : "Login"}
          </button>
        </>
      )}
    </>
  );
}

interface EditableLabelProps {
  phoneNumber: string;
  setShowOTP: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditableLabel: React.FC<EditableLabelProps> = ({
  phoneNumber,
  setShowOTP,
}) => {
  const handleEdit = () => {
    setShowOTP(false);
  };

  return (
    <div className="flex cursor-pointer items-center gap-2">
      <span className="my-2 mr-3 block font-medium text-gray-700">
        Phone Number +91 {phoneNumber}
      </span>
      <img
        src={"/images/login/edit_icon.svg"}
        alt={"Edit Phone number"}
        onClick={handleEdit}
      />
    </div>
  );
};

export default OTPInputComponent;
