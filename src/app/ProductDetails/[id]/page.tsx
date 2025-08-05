import { fetchProductDetails } from "@/utils/api";
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
import NetworkErrorPage from "@/components/NetworkErrorPage";
import { Suspense } from "react";
import Loader from "@/components/common/Loader";
import Link from "next/link";

export const metadata: Metadata = {
  title: "4 Dots",
  description:
    "This is Next.js Settings page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

// ✅ Ensure correct mapping of product components
const ProductComponents: Record<string, React.FC<{ product: any }>> = {
  "paper-print": PaperPrint,
  "photo-frame": PhotoFrame,
  "business-card": BusinessCard,
  "offset-printing": offSetPrinting,
  "letter-head": LetterHead,
  "canvas-printing": CanvasPrinting,
  "polaroid-card": PolaroidCard,
  "custom-name-slip": CustomNameSlip,
};

export default async function PageDetails({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { dataId: string };
}) {
  const { id } = params;
  const dataId = Number(searchParams.dataId);

  // ✅ Fetch product details server-side
  const product = await fetchProductDetails(dataId);

  if (!product) {
    return <p><NetworkErrorPage /></p>;
  }

  const SpecificProductComponent = ProductComponents[id.toLowerCase()];

  if (!SpecificProductComponent) {
    return <p><NetworkErrorPage /></p>;
  }

  return (
    <DefaultLayout>
      <Suspense fallback={<Loader />}>
      {/* Back Button - Moved to top */}
      <div className="px-4 sm:px-6 md:px-12 lg:px-20 py-6">
        <Link href="/" passHref>
          <div className="flex items-center cursor-pointer">
            <img
              src="/images/login/back-arrow.svg"
              alt="Back"
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
          </div>
        </Link>
      </div>
      
      {/* ✅ Pass product data to the specific product component */}
      <SpecificProductComponent product={product} />
      
      {/* ✅ Description part moved below the upload section */}
      {(() => {
         console.log("Product ID:", product?.id);
         console.log("Product Name:", product?.name);
         console.log("Condition check:", product?.id === 1 && product?.name === "Paper Printing");
         console.log("Should show description:", !(product?.id === 1 && product?.name === "Paper Printing"));
         return !(product?.id === 1 && product?.name === "Paper Printing") && <ProductDescription product={product} />;
       })()}
      </Suspense>
    </DefaultLayout>
  );
}
