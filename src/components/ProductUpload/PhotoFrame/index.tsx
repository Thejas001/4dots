"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PhotoFramePricingRule, Product } from "@/app/models/products";
import Product1DropDown from "./Product1DropDown";
import Link from "next/link";
import { fetchProductDetails } from "@/utils/api";
import { findPhotoFramePricingRule } from "@/utils/priceFinder";
import FileUploader from "./FileUploader";
import ImageSection from "./ImageSection";
import type { UploadFile } from "antd/es/upload";
import CartButton from "./CartButton";

const ProductUpload = ({ product }: { product: any }) => {
  const dataId = product.id;
  const productDetails = product; //stores state from dropdown and passed to princingfrle finder
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
  const [selectedFrameColor, setSelectedFrameColor] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [price, setPrice] = useState<number | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const calculatedPrice = selectedQuantity ? (price ?? 0) : 0;
  const [uploadedImages, setUploadedImages] = useState<UploadFile[]>([]);
  const [selectedPricingRule, setSelectedPricingRule] =
    useState<PhotoFramePricingRule | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!productDetails || !selectedSize || !selectedQuantity) return;

    if (errorMessage) {
      console.warn("Pricing rule not fetched due to validation error.");
      return;
    }

    const pricingrule = findPhotoFramePricingRule(
      productDetails.PhotoFramePricingRules,
      selectedSize,
      selectedQuantity.toString(),
    );
    if (pricingrule) {
      setPrice(pricingrule.Price); // Store the price in state
    } else {
      console.warn("No matching pricing rule found.");
      setPrice(null);
    }

    setSelectedPricingRule(pricingrule);
    console.log("Matched Pricing Rule:", pricingrule);
  }, [productDetails, selectedSize, selectedQuantity]);

  return (
    <div className="flex flex-col bg-white px-4 py-20 pb-[79px] pt-[31px] md:px-20">
      {/* First Row */}
      <div className="flex flex-col md:flex-row">
        {/* Left Section */}
        <FileUploader
          quantity={selectedQuantity}
          uploadedImages={fileList}
          setUploadedImages={setFileList}
        />
        {/* Right Section */}
        <div className="flex flex-1 flex-col justify-between rounded px-4 py-[25px] shadow md:px-7">
          {productDetails && (
            <Product1DropDown
              onSizeChange={setSelectedSize}
              onQuantityChange={setSelectedQuantity}
              productDetails={productDetails}
              UpdatedQuantity={selectedQuantity}
            />
          )}
          <div className="mt-10 flex-1 flex-col">
            <div className="">
              <label className="mb-2.5 block text-base font-medium leading-6 tracking-[-0.2px] text-[#242424]">
                Images Selection
              </label>
            </div>
            <ImageSection
              uploadedImages={fileList}
              setSelectedQuantity={setSelectedQuantity}
              setUploadedImages={setFileList}
            />
          </div>
          <div className="mt-10 flex-1 flex-col">
            <div>
              <label className="mb-2.5 block text-base font-medium leading-6 tracking-[-0.2px] text-[#242424]">
                Frame Color
              </label>
            </div>
            <div className="relative flex flex-row gap-7.5">
              {/* Black */}
              <label className="flex cursor-pointer items-center">
                <input
                  type="radio"
                  name="frame-color"
                  value="Black"
                  checked={selectedFrameColor === "Black"}
                  onChange={(e) => setSelectedFrameColor(e.target.value)}
                  className="peer hidden"
                />
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#242424] peer-checked:ring-2 peer-checked:ring-[#242424] peer-checked:ring-offset-2">
                  <div className="h-8.5 w-8.5 rounded-full bg-[#242424]"></div>
                </div>
                <span className="ml-1 text-base font-medium leading-6 tracking-[-0.2px] text-[#242424]">
                  Black
                </span>
              </label>

              {/* White */}
              <label className="flex cursor-pointer items-center">
                <input
                  type="radio"
                  name="frame-color"
                  value="White"
                  checked={selectedFrameColor === "White"}
                  onChange={(e) => setSelectedFrameColor(e.target.value)}
                  className="peer hidden"
                />
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#242424] peer-checked:ring-2 peer-checked:ring-[#242424] peer-checked:ring-offset-2">
                  <div className="h-8.5 w-8.5 rounded-full border border-[#242424] bg-[#ffffff]"></div>
                </div>
                <span className="ml-1 text-base font-medium leading-6 tracking-[-0.2px] text-[#242424]">
                  White
                </span>
              </label>

              {/* Brown */}
              <label className="flex cursor-pointer items-center">
                <input
                  type="radio"
                  name="frame-color"
                  value="Brown"
                  checked={selectedFrameColor === "Brown"}
                  onChange={(e) => setSelectedFrameColor(e.target.value)}
                  className="peer hidden"
                />
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#723100] peer-checked:ring-2 peer-checked:ring-[#723100] peer-checked:ring-offset-2">
                  <div className="h-8.5 w-8.5 rounded-full bg-[#723100]"></div>
                </div>
                <span className="ml-1 text-base font-medium leading-6 tracking-[-0.2px] text-[#242424]">
                  Brown
                </span>
              </label>
            </div>
          </div>

          {/**Cart Buttons */}
          <CartButton
            uploadedImages={fileList}
            dataId={dataId}
            selectedQuantity={selectedQuantity}
            calculatedPrice={calculatedPrice}
            selectedPricingRule={selectedPricingRule}
            selectedFrameColor={selectedFrameColor}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductUpload;
