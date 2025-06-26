"use client";

import Link from "next/link";
import React from "react";
import { useEffect, useState } from "react";
import { Product } from "@/app/models/products";
import { fetchProducts } from "@/utils/api";
import { Metadata } from "next";
import NetworkErrorPage from "../NetworkErrorPage";
 const metadata: Metadata = {
  title: "4 Dots",
  description:
    "This is Next.js Settings page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

interface ProductListProps {
  products: Product[];
}
// test

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const [hasError, setHasError] = useState(false);

  const formatName = (name: string) => {
    if (!name) return "";
    return name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const transformedData = products.map((product) => ({
    id: product.id,
    name: formatName(product.name),
  }));
  
  const getProductDetails = (id: number) => {
    return transformedData.find((product) => product.id === id);
  };

  return (
    <div className="grid grid-cols-12 gap-[7px] bg-[#fcfcfc] px-[25px] md:gap-6 md:px-20">
      <div className="col-span-12 flex items-center justify-center pb-1 pt-[27px] text-xl font-medium  text-[#242424]">
        Our Product
      </div>

      {/**Photo Frame */}
      <div data-id="2" className="relative col-span-7 h-[186px] overflow-hidden rounded-[7.137px] transition-shadow duration-300 hover:shadow-lg md:h-[522px] md:rounded-[20px] lg:col-span-5">
        <Link href={`/ProductDetails/photo-frame?dataId=2`} passHref> 
          <img
            src="/images/product/photo-frame.svg"
            alt="Photo Frames"
            className="aspect-[3/2] h-full w-full object-cover transition-transform duration-700 hover:scale-110"
          />
          <div className="absolute left-[11px] top-[11px] rounded-full bg-[#242424] px-2 py-1 text-[10px] font-medium leading-5 tracking-[0.4px] text-[#fff] md:left-3.5 md:top-3.5 md:text-xl">
          {getProductDetails(2)?.name || "Loading..."}

          </div>

          <button onClick={(e) => e.stopPropagation()} className="absolute bottom-[7.13px] right-[7.27px] flex items-center rounded-full border border-white bg-black bg-opacity-50 px-2 text-[8px] font-medium tracking-[0.096px] text-white transition duration-300 md:bottom-[25px] md:right-8.5 md:p-2.5 md:text-base">
              <span className="flex items-center">
                Starting From @
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                    <path d="M14.1667 5.49967V3.83301H5V5.49967H7.91667C9.00167 5.49967 9.9175 6.19801 10.2625 7.16634H5V8.83301H10.2625C10.0919 9.3193 9.77463 9.74073 9.3545 10.0392C8.93438 10.3377 8.43203 10.4986 7.91667 10.4997H5V12.5113L9.655 17.1663H12.0117L7.01167 12.1663H7.91667C8.87651 12.1646 9.80644 11.8322 10.5499 11.225C11.2933 10.6179 11.8048 9.77315 11.9983 8.83301H14.1667V7.16634H11.9983C11.8715 6.55954 11.6082 5.98958 11.2283 5.49967H14.1667Z" fill="#fff"/>
                  </svg>1000
                </span>
              </span>
          </button>
        </Link>
      </div>

      {/**paper print & Business Card*/}
      <div data-id="1" className="col-span-5 grid h-[186px] grid-rows-2 gap-2 overflow-hidden md:h-[522px] md:gap-6 lg:col-span-3">
        <div className=" relative col-span-12 overflow-hidden rounded-[7.137px] transition-shadow duration-300 hover:shadow-lg md:rounded-[20px]">
          <Link href={`/ProductDetails/paper-print?dataId=1`}>
            <img
              src="/images/product/photo-frame.svg"
              alt=""
              className="aspect-[3/2] h-full w-full object-cover transition-transform duration-700 hover:scale-110"
            />
            <div className="absolute left-[10px] top-[10px] rounded-full bg-[#242424] px-0.5 text-[10px] font-medium leading-5 tracking-[0.4px] text-[#fff] md:left-3.5 md:top-3.5 md:px-2 md:py-1 md:text-xl">
            {getProductDetails(1)?.name || "Loading..."}
            </div>
            <button className="absolute bottom-0 right-0 flex items-center rounded-full border border-white bg-black bg-opacity-50 px-2 text-[8px] font-medium tracking-[0.096px] text-white transition duration-300 md:bottom-[25px] md:right-8.5 md:p-2.5 md:text-base">
                  <span className="flex items-center">
                    Starting From @
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                        <path d="M14.1667 5.49967V3.83301H5V5.49967H7.91667C9.00167 5.49967 9.9175 6.19801 10.2625 7.16634H5V8.83301H10.2625C10.0919 9.3193 9.77463 9.74073 9.3545 10.0392C8.93438 10.3377 8.43203 10.4986 7.91667 10.4997H5V12.5113L9.655 17.1663H12.0117L7.01167 12.1663H7.91667C8.87651 12.1646 9.80644 11.8322 10.5499 11.225C11.2933 10.6179 11.8048 9.77315 11.9983 8.83301H14.1667V7.16634H11.9983C11.8715 6.55954 11.6082 5.98958 11.2283 5.49967H14.1667Z" fill="#fff"/>
                      </svg>1000
                    </span>
                  </span>
              </button>
          </Link>
        </div>

        <div data-id="3" className=" relative  col-span-12 overflow-hidden rounded-[7.137px] transition-shadow duration-300 hover:shadow-lg md:rounded-[20px]">
          <Link href={`/ProductDetails/business-card?dataId=3`}>
            <img
              src="images/product/businesscard.svg"
              alt=""
              className="aspect-[3/2] h-full w-full  object-cover transition-transform duration-700 hover:scale-110"
            />
            <div className="absolute left-[10px] top-[10px] rounded-full bg-[#242424] px-0.5 text-[10px] font-medium leading-5 tracking-[0.4px] text-[#fff] md:left-3.5 md:top-3.5 md:px-2 md:py-1 md:text-xl">
            {getProductDetails(3)?.name || "Loading..."}
            </div>
            <button className="absolute bottom-[7.13px] right-[7.27px] flex items-center rounded-full border border-white bg-black bg-opacity-50 px-2 text-[8px] font-medium tracking-[0.096px] text-white transition duration-300 md:bottom-[25px] md:right-8.5 md:p-2.5 md:text-base">
                <span className="flex items-center">
                  Starting From @
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                      <path d="M14.1667 5.49967V3.83301H5V5.49967H7.91667C9.00167 5.49967 9.9175 6.19801 10.2625 7.16634H5V8.83301H10.2625C10.0919 9.3193 9.77463 9.74073 9.3545 10.0392C8.93438 10.3377 8.43203 10.4986 7.91667 10.4997H5V12.5113L9.655 17.1663H12.0117L7.01167 12.1663H7.91667C8.87651 12.1646 9.80644 11.8322 10.5499 11.225C11.2933 10.6179 11.8048 9.77315 11.9983 8.83301H14.1667V7.16634H11.9983C11.8715 6.55954 11.6082 5.98958 11.2283 5.49967H14.1667Z" fill="#fff"/>
                    </svg>1000
                  </span>
                </span>
            </button>
          </Link>
        </div>
      </div>

      {/**Offset Printing*/}
      <div data-id="5" className="relative col-span-4 h-[163.729px] overflow-hidden rounded-[6.017px] bg-blue-300 transition-shadow duration-300 hover:shadow-lg md:h-[522px] md:rounded-[20px] lg:col-span-4">
        <Link href={`/ProductDetails/offset-printing?dataId=5`}>
          <img
            src="/images/product/first3.png"
            alt="Photo Frames"
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
          />
          <div className="absolute left-[11px] top-[11px] rounded-full bg-[#242424] px-1 text-[10px] font-medium leading-5 tracking-[0.4px] text-[#fff] md:left-3.5 md:top-3.5 md:px-2 md:py-1 md:text-xl">
          {getProductDetails(5)?.name || "Loading..."}
          </div>
            <button className="absolute bottom-[7.13px] right-[7.27px] flex items-center rounded-full border border-white bg-black bg-opacity-50 px-2 text-[8px] font-medium tracking-[0.096px] text-white transition duration-300 md:bottom-[25px] md:right-8.5 md:p-2.5 md:text-base">
                <span className="flex items-center">
                  Starting From @
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                      <path d="M14.1667 5.49967V3.83301H5V5.49967H7.91667C9.00167 5.49967 9.9175 6.19801 10.2625 7.16634H5V8.83301H10.2625C10.0919 9.3193 9.77463 9.74073 9.3545 10.0392C8.93438 10.3377 8.43203 10.4986 7.91667 10.4997H5V12.5113L9.655 17.1663H12.0117L7.01167 12.1663H7.91667C8.87651 12.1646 9.80644 11.8322 10.5499 11.225C11.2933 10.6179 11.8048 9.77315 11.9983 8.83301H14.1667V7.16634H11.9983C11.8715 6.55954 11.6082 5.98958 11.2283 5.49967H14.1667Z" fill="#fff"/>
                    </svg>1000
                  </span>
                </span>
            </button>
        </Link>
      </div>

      {/**Letter Head & Canvas printing*/}
      <div data-id="4" className="col-span-8 grid grid-cols-12 gap-2 md:gap-6 lg:col-span-12">
        <div className="relative col-span-12 h-[78.525px] overflow-hidden rounded-[8.541px] bg-pink-300 transition-shadow duration-300 hover:shadow-lg sm:h-[249px] md:rounded-[20px] lg:col-span-8">
          <Link href={`/ProductDetails/letter-head?dataId=4`}>
            <img
              src="/images/product/first4.png"
              alt=""
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
            />
            <div className="absolute left-[11px] top-[11px] rounded-full bg-[#242424] px-1 text-[10px] font-medium leading-5 tracking-[0.4px] text-[#fff] md:left-3.5 md:top-3.5 md:px-2 md:py-1 md:text-xl">
            {getProductDetails(4)?.name || "Loading..."}
            </div>
              <button className="absolute bottom-[7.13px] right-[7.27px] flex items-center rounded-full border border-white bg-black bg-opacity-50 px-2 text-[8px] font-medium tracking-[0.096px] text-white transition duration-300 md:bottom-[25px] md:right-8.5 md:p-2.5 md:text-base">
                <span className="flex items-center">
                  Starting From @
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                      <path d="M14.1667 5.49967V3.83301H5V5.49967H7.91667C9.00167 5.49967 9.9175 6.19801 10.2625 7.16634H5V8.83301H10.2625C10.0919 9.3193 9.77463 9.74073 9.3545 10.0392C8.93438 10.3377 8.43203 10.4986 7.91667 10.4997H5V12.5113L9.655 17.1663H12.0117L7.01167 12.1663H7.91667C8.87651 12.1646 9.80644 11.8322 10.5499 11.225C11.2933 10.6179 11.8048 9.77315 11.9983 8.83301H14.1667V7.16634H11.9983C11.8715 6.55954 11.6082 5.98958 11.2283 5.49967H14.1667Z" fill="#fff"/>
                    </svg>1000
                  </span>
                </span>
            </button>
          </Link>
        </div>

        {/**Canvas Printing */}
        <div data-id="6" className="relative col-span-12 h-[79px] overflow-hidden rounded-[8.541px] bg-blue-300 transition-shadow duration-300 hover:shadow-lg sm:h-[249px] md:rounded-[20px] lg:col-span-4">
          <Link href={`/ProductDetails/canvas-printing?dataId=6`}>
            <img
              src="/images/product/first5.png"
              alt="Photo Frames"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
            />
            <div className="absolute left-[11px] top-[11px] rounded-full bg-[#242424] px-1 text-[10px] font-medium leading-5 tracking-[0.4px] text-[#fff] md:left-3.5 md:top-3.5 md:px-2 md:py-1 md:text-xl">
            {getProductDetails(6)?.name || "Loading..."}
            </div>
              <button className="absolute bottom-[7.13px] right-[7.27px] flex items-center rounded-full border border-white bg-black bg-opacity-50 px-2 text-[8px] font-medium tracking-[0.096px] text-white transition duration-300 md:bottom-[25px] md:right-8.5 md:p-2.5 md:text-base">
                <span className="flex items-center">
                  Starting From @
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                      <path d="M14.1667 5.49967V3.83301H5V5.49967H7.91667C9.00167 5.49967 9.9175 6.19801 10.2625 7.16634H5V8.83301H10.2625C10.0919 9.3193 9.77463 9.74073 9.3545 10.0392C8.93438 10.3377 8.43203 10.4986 7.91667 10.4997H5V12.5113L9.655 17.1663H12.0117L7.01167 12.1663H7.91667C8.87651 12.1646 9.80644 11.8322 10.5499 11.225C11.2933 10.6179 11.8048 9.77315 11.9983 8.83301H14.1667V7.16634H11.9983C11.8715 6.55954 11.6082 5.98958 11.2283 5.49967H14.1667Z" fill="#fff"/>
                    </svg>1000
                  </span>
                </span>
            </button>
          </Link>
        </div>
      </div>

      {/**Polaroid cards & NameSlip*/}
      <div data-id="7" className="relative col-span-6 h-[139.226px] overflow-hidden rounded-[8.541px] bg-pink-300 transition-shadow duration-300 hover:shadow-lg sm:h-[326px] md:rounded-[20px] lg:col-span-6">
        <Link href={`/ProductDetails/polaroid-card?dataId=7`}>
          <img
            src="/images/product/polaroid.png"
            alt="Photo Frames"
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
          />
          <div className="absolute left-[11px] top-[11px] rounded-full bg-[#242424] px-1 text-[10px] font-medium leading-5 tracking-[0.4px] text-[#fff] md:left-3.5 md:top-3.5 md:px-2 md:py-1 md:text-xl">
          {getProductDetails(7)?.name || "Loading..."}
          </div>
            <button className="absolute bottom-[7.13px] right-[7.27px] flex items-center rounded-full border border-white bg-black bg-opacity-50 px-2 text-[8px] font-medium tracking-[0.096px] text-white transition duration-300 md:bottom-[25px] md:right-8.5 md:p-2.5 md:text-base">
                <span className="flex items-center">
                  Starting From @
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                      <path d="M14.1667 5.49967V3.83301H5V5.49967H7.91667C9.00167 5.49967 9.9175 6.19801 10.2625 7.16634H5V8.83301H10.2625C10.0919 9.3193 9.77463 9.74073 9.3545 10.0392C8.93438 10.3377 8.43203 10.4986 7.91667 10.4997H5V12.5113L9.655 17.1663H12.0117L7.01167 12.1663H7.91667C8.87651 12.1646 9.80644 11.8322 10.5499 11.225C11.2933 10.6179 11.8048 9.77315 11.9983 8.83301H14.1667V7.16634H11.9983C11.8715 6.55954 11.6082 5.98958 11.2283 5.49967H14.1667Z" fill="#fff"/>
                    </svg>1000
                  </span>
                </span>
            </button>
        </Link>
      </div>

      {/**Name Slip*/}
      <div data-id="8" className="relative col-span-6 h-[139.226px] overflow-hidden rounded-[8.541px] bg-blue-300 transition-shadow duration-300 hover:shadow-lg sm:h-[326px] md:rounded-[20px] lg:col-span-6">
        <Link href={`ProductDetails/custom-name-slip?dataId=8`}>
          <img
            src="/images/product/polaroid.png"
            alt="Photo Frames"
            className="aspect-[3/2] h-full w-full object-cover transition-transform duration-700 hover:scale-110"
          />
          <div className="absolute left-[11px] top-[11px] rounded-full bg-[#242424] px-1 text-[10px] font-medium leading-5 tracking-[0.4px] text-[#fff] md:left-3.5 md:top-3.5 md:px-2 md:py-1 md:text-xl">
          {getProductDetails(8)?.name || "Loading..."}
          </div>
            <button className="absolute bottom-[7.13px] right-[7.27px] flex items-center rounded-full border border-white bg-black bg-opacity-50 px-2 text-[8px] font-medium tracking-[0.096px] text-white transition duration-300 md:bottom-[25px] md:right-8.5 md:p-2.5 md:text-base">
                <span className="flex items-center">
                  Starting From @
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                      <path d="M14.1667 5.49967V3.83301H5V5.49967H7.91667C9.00167 5.49967 9.9175 6.19801 10.2625 7.16634H5V8.83301H10.2625C10.0919 9.3193 9.77463 9.74073 9.3545 10.0392C8.93438 10.3377 8.43203 10.4986 7.91667 10.4997H5V12.5113L9.655 17.1663H12.0117L7.01167 12.1663H7.91667C8.87651 12.1646 9.80644 11.8322 10.5499 11.225C11.2933 10.6179 11.8048 9.77315 11.9983 8.83301H14.1667V7.16634H11.9983C11.8715 6.55954 11.6082 5.98958 11.2283 5.49967H14.1667Z" fill="#fff"/>
                    </svg>1000
                  </span>
                </span>
            </button>
        </Link>

      </div>
    </div>
  );
};

export default ProductList;
