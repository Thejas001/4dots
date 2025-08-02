"use client"
import React, { useState, useEffect, useRef } from 'react';

interface CarouselItem {
  id: number;
  name: string;
  image: string;
  description: string;
}

const carouselItems: CarouselItem[] = [
  { 
    id: 1, 
    name: 'PHOTO FRAME', 
    image: '/images/product/frame.png',
    description: 'Custom photo frames in various sizes and styles.'
  },
  { 
    id: 2, 
    name: 'POLAROID', 
    image: '/images/product/polaroidnew.png',
    description: 'Vintage-style polaroid cards with instant appeal.'
  },
  { 
    id: 3, 
    name: 'NAME SLIP', 
    image: '/images/product/nameslip.jpg',
    description: 'Personalized nameplates for your home or office.'
  },
];

const Hero: React.FC = () => {
  const [active, setActive] = useState(0);
  const [calculation, setCalculation] = useState(1);
  const lastPosition = carouselItems.length - 1;
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const isPaused = useRef(false);

  const startAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      if (!isPaused.current) {
        setActive((prev) => (prev + 1 > lastPosition ? 0 : prev + 1));
        setCalculation(1);
      }
    }, 5000);
  };

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    isPaused.current = true;
  };

  const handleMouseLeave = () => {
    isPaused.current = false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#18181b] to-[#232323] text-white font-poppins">
      <header className="fixed z-10 w-full max-w-[1200px] mx-auto top-0 left-1/2 -translate-x-1/2 flex items-center justify-between py-4 px-5">
        <div className="logo">
          <img src="img/logo.png" alt="Logo" className="w-[50px]" />
        </div>
        <nav>
          <ul className="flex space-x-10">
            <li className="text-lg">HOME</li>
            <li className="text-lg">INFO</li>
            <li className="text-lg">LOGIN</li>
          </ul>
        </nav>
      </header>

      <section
        className="carousel h-screen overflow-hidden relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="list max-w-[1200px] mx-auto h-full relative px-4">
          {carouselItems.map((item, index) => (
            <div
              key={item.id}
              className={`item absolute inset-0 transition-all duration-500 ${
                index === active ? 'opacity-100 translate-x-0' : 'opacity-0'
              } ${index === active ? '' : index < active ? '-translate-x-full' : 'translate-x-full'}`}
              style={{ '--calculation': calculation } as React.CSSProperties}
            >
              {/* Mobile Layout */}
              <div className="md:hidden flex flex-col h-full justify-center items-center text-center px-4">
                <figure className="w-full max-w-[400px] mb-6">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-auto object-contain transition-transform duration-500  rotate-[15deg]"
                  />
                </figure>
                <div className="content z-20 flex flex-col items-center gap-4">
                  <h2 className="font-league-gothic text-4xl sm:text-6xl leading-none">{item.name}</h2>
                  <p className="description max-w-[300px] text-sm text-center text-white/70">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:flex h-full relative">
                <figure className="absolute w-[350%] lg:w-[40%] top-1/2 -translate-y-1/2 left-0  rotate-[15deg]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-auto object-contain transition-transform duration-500"
                  />
                  <div className="absolute bg-[#0b0b1b] w-full h-[100px] top-[150%] left-[50px] rounded-full blur-[50px]"></div>
                </figure>
                <div className="content absolute z-20 w-[45%] lg:w-[35%] h-full right-0 flex flex-col justify-center items-end gap-5 pr-8">
                  <p className="category font-medium"></p>
                  <h2 className="font-league-gothic text-6xl lg:text-8xl xl:text-[11em] leading-none text-right">{item.name}</h2>
                  <p className="description max-w-[400px] text-sm text-right text-white/50">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="indicators absolute bottom-8 md:top-[52%] w-full max-w-[1200px] left-1/2 -translate-x-1/2 flex flex-col justify-end gap-2 pointer-events-none px-4">
          <div className="number font-league-gothic text-2xl md:text-[7vw] text-center md:text-left md:-mb-[-30px]">{String(active + 1).padStart(2, '0')}</div>
          <ul className="flex gap-2 justify-center md:justify-start">
            {carouselItems.map((_, index) => (
              <li
                key={index}
                className={`w-[30px] md:w-[50px] h-[3px] md:h-[5px] rounded-full transition-all ${
                  index === active ? 'bg-yellow-400' : 'bg-[#659cdf]'
                }`}
              ></li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Hero;