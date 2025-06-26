import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { fetchProducts } from "@/utils/api";

export const metadata: Metadata = {
  title: "4 Dots",
  description: "This is a Printing Website",
};

export default async  function Home() {
  const products = await fetchProducts(); 
  return (
    <>
      <DefaultLayout>
        <ECommerce products={products} />
      </DefaultLayout>
    </>
  );
}