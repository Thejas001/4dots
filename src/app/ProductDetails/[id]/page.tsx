"use client";
import { useParams, useSearchParams  } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ProductDescription from "@/components/ProductDescription";
import PaperPrint from "@/components/ProductUpload/PaperPrint";
import PhotoFrame from "@/components/ProductUpload/PhotoFrame";
import BusinessCard from "@/components/ProductUpload/BusinessCard";
import offSetPrinting from "@/components/ProductUpload/OffSetPrinting";
import LetterHead from "@/components/ProductUpload/LetterHead";
import CanvasPrinting from "@/components/ProductUpload/CanvasPrinting";
import PolaroidCard from "@/components/ProductUpload/PolaroidCard";
import CustomNameSlip from "@/components/ProductUpload/CustomNameSlip";
import { Metadata } from "next";

 const metadata: Metadata = {
  title: "4 Dots",
  description:
    "This is Next.js Settings page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const ProductComponents: Record<string, React.FC<{ id: string; dataId: number }>> = {
  "paper-print": PaperPrint, 
  "photo-frame": PhotoFrame,
  "business-card": BusinessCard,
  "offset-printing": offSetPrinting,
  "letter-head": LetterHead,
  "canvas-printing": CanvasPrinting,
  "polaroid-card": PolaroidCard,
  "custom-name-slip":  CustomNameSlip,// ✅ Ensure key matches the expected URL
};

const PageDetails = () => {
  const { id } = useParams(); // ✅ Extract dynamic ID
  const searchParams = useSearchParams();
  const dataId =Number(searchParams.get("dataId"));
  console.log("Product ID:", dataId); 
  
  if (!id || typeof id !== "string") {
    return <p>Product not found</p>;
  }

  const SpecificProductComponent = ProductComponents[id.toLowerCase()]; // ✅ Ensures case-insensitive matching

  if (!SpecificProductComponent) {
    return <p>Product not found</p>;
  }

  return (
    <DefaultLayout>
      <ProductDescription dataId={dataId} />
      <SpecificProductComponent id={id} dataId={dataId} />
    </DefaultLayout>
  );
};

export default PageDetails;
