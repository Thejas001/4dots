"use client";

import { useEffect, useState } from 'react';
import Link from "next/link";
import PaymentCal from "../YourCart/PaymentCal";
import Address from "./Address";
import { fetchUserOrder, getUserAddress } from "@/utils/api";

interface Attribute {
  OrderItemAttributeId: number;
  AttributeName: string;
  AttributeValue: string;
}

interface Item {
  OrderItemId: number;
  ProductName: string;
  Quantity: number;
  Price: number;
  Attributes: Attribute[];
}

interface Order {
  OrderId: number;
  TotalAmount: number;
  OrderStatus: string;
  CreatedAt: string;
  Payment: {
    PaymentMethod: string;
    PaymentStatus: string;
    PaymentDate: string;
  };
  Shipment: {
    ShippingStatus: string;
  };
  Items: Item[];
}

const OrderPayment = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [address, setAddress] = useState([]);
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [errorAddress, setErrorAddress] = useState("");
 


  const userId = 2; // Replace with actual user ID

  const fetchAddress = async () => {
    try {
      setLoadingAddress(true);
      setErrorAddress("");
      const addressData = await getUserAddress();
      setAddress(addressData);
    } catch (err) {
      setErrorAddress((err as any)?.message || "Failed to fetch address");
    } finally {
      setLoadingAddress(false);
    }
  };

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchUserOrder();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
    fetchAddress();
  }, [userId]);

  if (loading) {
    return <p>Loading orders...</p>;
  }

  return (
    <div className="grid h-auto grid-rows-[auto,1fr] bg-[#fff]">
      {/* Top Section */}
      <div className="mt-4 flex items-center gap-[33.5px] px-20">
        {/* Back Button */}
        <div className="rounded-[4px] border border-[#242424] p-1">
          <Link href="/Cart">
            <div className="cursor-pointer text-gray-600 hover:text-gray-900">
              <img
                src="/images/icon/Arrow-icon.svg"
                alt="Back"
                className="h-4 w-4"
              />
            </div>
          </Link>
        </div>
        {/* Your Cart Text */}
        <span className="text-[22px] font-normal leading-[26px] text-[#000]">
          Payment
        </span>
      </div>

      {/* Bottom Section */}
      <div className="mt-9 grid h-auto w-auto grid-cols-12 pl-36 xl:grid-cols-2">
        {orders.length > 0 ? (
          <>
            <div className="flex flex-col">
              {orders.map(order => (
                <div key={order.OrderId}>
                  {order.Items.map(item => (
                    <div key={item.OrderItemId} className="bg-lightgray mb-7 col-span-12 flex rounded-[20px] border border-[#ECECEC] bg-cover bg-center bg-no-repeat xl:col-span-1">
                      <div className="flex">
                        <img
                          src="/images/product/Rectangle4597.svg"
                          alt="Product Image"
                          className="contain"
                        />
                      </div>
                      <div className="ml-3 flex flex-1 flex-col">
                        <div className="mt-[13px] flex items-center xl:w-[448px]">
                          <span className="flex-grow text-sm font-semibold text-[#000] xl:text-[34px]">
                            {item.ProductName}
                          </span>
                        </div>
                        <div className="mt-8 flex items-center gap-7.5 text-[#242424]">
                          <span className="text-base font-medium leading-6 tracking-[-0.2px]">
                            <span>Selected Size:</span>
                            <span className="pl-[9px]">
                              {item.Attributes.find(attr => attr.AttributeName === "Size")?.AttributeValue || "N/A"}
                            </span>
                          </span>
                          <div className="flex gap-7.5 text-[#242424]">
                            <span className="text-base font-medium leading-6 tracking-[-0.2px]">
                              <span>Quantity :</span>
                              <span className="pl-[9px]">{item.Quantity} pcs</span>
                            </span>
                            <span className="pr-5 text-base font-medium italic leading-6 tracking-[-0.2px] text-[#0075FF] underline">
                              Uploaded Design
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {/* Address Section */}
              <div className="bg-lightgray relative col-span-12 mt-6 flex rounded-[20px] border border-[#ECECEC] bg-cover bg-center bg-no-repeat xl:col-span-1">
                <Address
                  address={address}
                  loading={loadingAddress}
                  error={!!errorAddress}
                  refreshAddresses={fetchAddress}
                />
              </div>

              {/* Estimated Delivery Section */}
              <div className="bg-lightgray col-span-12 mt-6 flex rounded-[10px] border border-[#ECECEC] bg-cover bg-center bg-no-repeat xl:col-span-1">
                <div className="ml-6 flex flex-1 flex-col">
                  <div className="mb-[18.5px] mt-[17.5px] flex items-start">
                    <div className="flex-shrink-0">
                      <label className="text-sm font-semibold text-[#000] xl:text-lg">
                        Delivery Estimates :
                      </label>
                    </div>
                    <div className="ml-2 xl:w-[429px]">
                      <span className="h-auto text-sm font-medium text-[#000] xl:text-lg">
                        Estimated delivery by
                      </span>
                      <span className="h-auto pl-1 text-sm font-semibold text-[#000] xl:text-xl">
                        9 Dec 2024
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Calculator */}
            <div className="col-span-12 xl:col-span-1 ml-[22px] mr-20">
            
            {/*<PaymentCal  />*/}
            </div>
          </>
        ) : (
          <div className="text-center mt-10">
            <p>No orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPayment;