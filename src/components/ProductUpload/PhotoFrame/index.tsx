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



const ProductUpload = ({ id, dataId }: { id: string; dataId: number }) => {
  const [productDetails, setProductDetails] = useState<Product | null>(null);
//stores state from dropdown and passed to princingfrle finder
   const [selectedSize, setSelectedSize] = useState<string>("");
   const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
   const [errorMessage, setErrorMessage] = useState<string>("");
   const [price, setPrice] = useState<number | null>(null);
   const [fileList, setFileList] = useState<UploadFile[]>([]);
   const calculatedPrice = selectedQuantity ? price ?? 0 : 0;
   const [uploadedImages, setUploadedImages] = useState<UploadFile[]>([]);
   const [selectedPricingRule, setSelectedPricingRule] = useState<PhotoFramePricingRule | null>(null);
   
   const router = useRouter();

  const loadProductDetails = useCallback(async () => {
    if (!dataId) return;

    try {
      const data = await fetchProductDetails(dataId);
      console.log("Fetched Product Details:", data);
      setProductDetails(data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  }, [dataId]);

  useEffect(() => {
    loadProductDetails();
  }, [loadProductDetails]);

  useEffect(() => {
    if (!productDetails || !selectedSize || !selectedQuantity) return;

    if (errorMessage) {
      console.warn("Pricing rule not fetched due to validation error.");
      return;
    }

    const pricingrule = findPhotoFramePricingRule(
      productDetails.PhotoFramePricingRules,
      selectedSize,
      selectedQuantity.toString()
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
    <div className="flex flex-col pt-[31px] bg-white px-4 md:px-20 pb-[79px] py-20">
      {/* First Row */}
      <div className="flex flex-col md:flex-row">
        {/* Left Section */}
        <FileUploader quantity={selectedQuantity}  onImagesChange={setFileList}/>
        {/* Right Section */}
        <div className="flex flex-1 flex-col justify-between px-4 md:px-7 py-[25px] rounded shadow">
        {productDetails && <Product1DropDown 
              onSizeChange={setSelectedSize}
              onQuantityChange={setSelectedQuantity}
              productDetails={productDetails}
              UpdatedQuantity={selectedQuantity}
         />}
          <div className="flex-1 flex-col mt-10">
            <div className="">
                 <label className="block text-[#242424] text-base font-medium leading-6 tracking-[-0.2px] mb-2.5">Images Selection</label>
            </div>
            <ImageSection  uploadedImages={fileList} setSelectedQuantity={setSelectedQuantity} setUploadedImages={setFileList} />
          </div>
          <div className="flex-1 flex-col mt-10">
            <div className="">
                    <label className="block text-[#242424] text-base font-medium leading-6 tracking-[-0.2px] mb-2.5">Frame Color</label>
            </div>
            <div className="relative flex flex-row gap-7.5">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="frame-color"
                  value="Black"
                  className="peer hidden"
                />
                <div className="w-10 h-10 rounded-full border-2 border-[#242424] flex items-center justify-center">
                  <div className="w-8.5 h-8.5 rounded-full bg-[#242424]"></div>
                </div>
                <span className="ml-1 text-base font-medium leading-6 tracking-[-0.2px] text-[#242424]">Black</span>
             </label>
             <label className="flex items-center cursor-pointer">
                <input
                type="radio"
                name="frame-color"
                value="Black"
                className="peer hidden"
                />
                <div className="w-8.5 h-8.5 rounded-full border-2 border-[#242424] peer-checked:bg-[#fff]"></div>
                <span className="ml-1 text-base font-medium leading-6 tracking-[-0.2px] text-[#242424]">White</span>
              </label>
              <label className="flex items-center cursor-pointer">
                  <input
                  type="radio"
                  name="frame-color"
                  value="Black"
                  className="peer hidden"
                  />
                  <div className="w-8.5 h-8.5 rounded-full border-2 border-[#723100] bg-[#723100]"></div>
                  <span className="ml-1 text-base font-medium leading-6 tracking-[-0.2px] text-[#242424]">Brown</span>
              </label>
            </div>
          </div>
          {/**Cart Buttons */}
          <CartButton dataId={dataId} selectedQuantity={selectedQuantity} calculatedPrice={calculatedPrice} selectedPricingRule={selectedPricingRule}  />
        </div>
      </div>
    </div>  
    );
  };


export default ProductUpload;
