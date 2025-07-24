"use client";
import dynamic from "next/dynamic";
import React from "react";
import ProductList from "../ProductList";
import { Product } from "@/app/models/products";

interface ECommerceProps {
  products: Product[];
}

const ECommerce: React.FC<ECommerceProps> = ({ products }) => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4  sm:col-span-12 xl:col-span-12 2xl:col-span-12 3xl:col-span-12">
          <ProductList  products={products} />
      </div>
      {/** */}
      <div className="md:pt-10 md:pb-[47.7px] pt-15 pb-12.5 bg-[#fff]">
      </div>
        
    </>
  );
};

export default ECommerce;
