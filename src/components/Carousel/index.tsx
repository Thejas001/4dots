"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "/images/login/sign_in_carousel.svg",
  "/images/login/sign_in_carousel.svg",
  "/images/login/sign_in_carousel.svg",
  "/images/login/sign_in_carousel.svg",
];

export default function Carousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3000); // Auto-slide every 3 seconds
    return () => clearInterval(interval);
  }, [index]);

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <div className="overflow-hidden rounded-xl shadow-lg">
        <AnimatePresence mode="wait">
          <motion.img
            key={index} // Ensure each image has a unique key
            src={images[index]}
            alt={`Slide ${index + 1}`}
            className="object-cover"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </AnimatePresence>
      </div>

      {/* Dots Indicator */}
      {/* <div className="mt-2 flex justify-center gap-2">
        {images.map((_, i) => (
          <div
            key={i}
            className={`h-3 w-3 rounded-full transition-all ${
              i === index ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div> */}
    </div>
  );
}
