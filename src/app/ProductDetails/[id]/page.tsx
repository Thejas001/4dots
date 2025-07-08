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
      {/* ✅ Pass fetched product details to ProductDescription */}
      <ProductDescription product={product} />

      {/* ✅ Pass product data to the specific product component */}
      <SpecificProductComponent product={product} />
      </Suspense>
    </DefaultLayout>
  );
}
