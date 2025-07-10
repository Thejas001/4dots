"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const images = [
  "/images/login/sign_in_carousel.svg",
  "/images/login/sign_in_carousel.svg",
  "/images/login/sign_in_carousel.svg",
  "/images/login/sign_in_carousel.svg",
];

export default function Carousel() {
  const [index, setIndex] = useState(0);
  const [firstRender, setFirstRender] = useState(true); // ✅ Track first mount to skip animation

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3000); // Auto-slide every 3 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setFirstRender(false);
  }, []);
  

  return (
    <div className="relative mx-auto w-full max-w-3xl aspect-[4/3]">
      <div className="overflow-hidden rounded-xl shadow-lg">
        <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={firstRender ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}          
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <Image
            src={images[index]}
            alt={`Slide ${index + 1}`}
            width={600} // Adjust to your container width
            height={600} // Maintain aspect ratio
            className="object-cover w-full h-auto"
            priority={index === 0} // Prioritize the first image
          />
          </motion.div>
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
