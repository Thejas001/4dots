"use client";
import React, { useEffect, useState } from "react";
import { fetchUserOrder } from "@/utils/api";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import ProgressBar from "./progressbar";
import { getUserAddress } from "@/utils/api";

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
  Price: number;
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

interface OrderDetailsComponentProps {
  orderId: string;
}

interface AddressType {
  Id: number;
  Address: string;
  City: string;
  Country: string;
  PinCode: string;
  IsPrimary: boolean;
}

const OrderDetailsComponent: React.FC<OrderDetailsComponentProps> = ({
  orderId,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [address, setAddress] = useState<AddressType[]>([]);
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {},
  );
  const router = useRouter();

  useEffect(() => {
    const fetchAddress = async () => {
      setLoading(true);
      try {
        const data = await getUserAddress();
        setAddress(data); // ✅ Adjust if your API returns nested structure
      } catch (err) {
        console.error("Failed to fetch address", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, []);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchUserOrder(); // assuming this fetches all orders
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  if (loading) {
    return <p>Loading orders...</p>;
  }

  const selectedOrder = orders.find(
    (order) => order.OrderId === parseInt(orderId),
  );

  if (!selectedOrder) {
    return <p>No order found with ID {orderId}</p>;
  }

  const handleToggle = (itemId: number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };
  return (
    <div className="w-2xl grid h-auto  grid-rows-[auto,1fr] bg-[#fff]">
      {/* Top Section */}
      <div className=" my-2 ml-20 flex flex-row">
        <img
          src={"/images/login/back-arrow.svg"}
          alt={"SignIn Cover"}
          className="cursor-pointer"
          onClick={() => router.back()}
        />
        {/* Your Cart Text */}
        <span className="ml-9 text-[22px] font-normal leading-[26px] text-[#000]">
          Your Order
        </span>
        <div></div>
      </div>
      <div className="grid w-full grid-cols-12">
        <div className="sticky top-10 ml-[-100px] xl:ml-0  col-span-1 pl-8">
          <ProgressBar orderStatus={selectedOrder.OrderStatus} />
        </div>
        {/* Bottom Section */}
        <div className="mb-10 mt-9 grid h-auto grid-cols-3 gap-4 ml-[60px]  xl:grid-cols-12 w-full">
          {orders.length > 0 ? (
            <div className="flex flex-col ">
              {selectedOrder.Items.map((item, index) => (
                <div
                  key={`${selectedOrder.OrderId}-${index}`}
                  className="bg-lightgray col-span-12 mb-4 flex flex-col rounded-[10px] border border-[#E9E9E9] bg-white p-5 shadow-[0px_4px_16px_0px_rgba(91,91,91,0.20)] w-[300px] xl:w-[1143px]"
                >
                  {/* Centered Heading */}

                  {/**Second row */}
                  <div className="mt-2 flex">
                    <img
                      src="/images/product/Rectangle4597.svg"
                      alt="Product Image"
                      className="bg-lightgray h-[113px] w-[107px] rounded-md border border-[#ECECEC] bg-cover bg-center bg-no-repeat object-cover"
                    />

                    {/**Right Section */}
                    <div className="ml-4 mt-2 flex flex-1 flex-col">
                      <div className=" flex items-center justify-between">
                        <div className="">
                          <span className="text-md flex-grow  font-semibold text-[#000] xl:text-xl">
                            {item.ProductName}
                          </span>
                        </div>
                        {/*Cancel Button
                        <div className="text-[18px]  font-normal leading-[24px] tracking-[-0.2px] text-[#E50000]">
                          Cancel Order
                        </div>*/}
                      </div>

                      {/*Address*/}

                      <div className="mb-0 mt-3 flex items-start">
                        <div className="flex-shrink-0">
                          <label className="text-sm font-medium text-[#000] xl:text-base ">
                            Address :
                          </label>
                        </div>
                        <div className="ml-2">
                          {loading ? (
                            <span className="text-sm font-medium text-[#000] xl:text-base">
                              Loading...
                            </span>
                          ) : address.length > 0 ? (
                            <span className="h-auto text-sm font-medium text-[#000] xl:text-base">
                              {address[0].Address}, {address[0].City},{" "}
                              {address[0].Country} - {address[0].PinCode}
                            </span>
                          ) : (
                            <span className="text-sm font-medium text-[#000] xl:text-base">
                              No address found
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-semibold text-[#000]">
                            Paid Amount :
                          </span>
                          <span className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="15"
                              viewBox="0 0 14 15"
                              fill="none"
                            >
                              <path
                                d="M9.91667 4.00016V2.8335H3.5V4.00016H5.54167C6.30117 4.00016 6.94225 4.489 7.18375 5.16683H3.5V6.3335H7.18375C7.0643 6.6739 6.84224 6.9689 6.54815 7.17784C6.25406 7.38679 5.90242 7.4994 5.54167 7.50016H3.5V8.90833L6.7585 12.1668H8.40817L4.90817 8.66683H5.54167C6.21356 8.6656 6.86451 8.4329 7.38491 8.00791C7.90531 7.58292 8.26338 6.99159 8.39883 6.3335H9.91667V5.16683H8.39883C8.31005 4.74207 8.12573 4.3431 7.85983 4.00016H9.91667Z"
                                fill="#242424"
                              />
                            </svg>

                            <span className="text-sm font-semibold text-[#000]">
                              {item.Price}
                            </span>
                          </span>
                        </div>
                        <div
                          onClick={() => handleToggle(item.OrderItemId)}
                          className="decoration-skip-ink-none cursor-pointer text-[18px] font-normal leading-[24px] tracking-[-0.2px] text-primary underline decoration-solid decoration-auto underline-offset-auto"
                        >
                          {expandedItems[item.OrderItemId]
                            ? "Hide Detail"
                            : "View Detail"}
                        </div>
                      </div>

                      {/* Expandable content */}
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={
                          expandedItems[item.OrderItemId]
                            ? { height: "auto", opacity: 1 }
                            : { height: 0, opacity: 0 }
                        }
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 flex flex-col gap-2">
                          {item.Attributes.map((attr) => (
                            <div
                              key={attr.OrderItemAttributeId}
                              className="text-sm font-semibold text-[#000"
                            >
                              <span className="text-sm font-semibold text-[#000">
                                {attr.AttributeName}:
                              </span>{" "}
                              <span className="text-sm font-semibold text-[#000e">
                                {attr.AttributeValue}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-10 text-center">
              <p>No orders found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsComponent;
