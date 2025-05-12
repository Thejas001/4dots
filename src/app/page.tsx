import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { fetchProducts } from "@/utils/api";
import OfflineWrapper from "@/components/OfflineWrapper";
import NetworkErrorPage from "@/components/NetworkErrorPage";

export const metadata: Metadata = {
  title: "4 Dots",
  description: "This is a Printing Website",
};

export default async function Home() {
  const products = await fetchProducts();

  return (
    <OfflineWrapper>
      <DefaultLayout>
        {products && products.length > 0 ? (
          <ECommerce products={products} />
        ) : (
          <NetworkErrorPage />
        )}
      </DefaultLayout>
    </OfflineWrapper>
  );
}
