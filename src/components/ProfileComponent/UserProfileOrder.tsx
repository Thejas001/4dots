"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchUserOrder } from "@/utils/api";

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

const UserProfileOrder = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});

    const userId = 2; // Replace with actual user ID

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
    }, [userId]);

    if (loading) {
        return <p>Loading orders...</p>;
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date.getFullYear()}`;
    };

    const toggleExpand = (orderItemId: number) => {
        setExpandedItems((prev) => ({
            ...prev,
            [orderItemId]: !prev[orderItemId],
        }));
    };

    return (
        <div className="rounded-[10px] border border-[#ECECEC] pr-2.5 pl-5 col-span-12 mt-4 xl:col-span-1 pb-7.5">
            <div className="w-full text-xl font-normal text-[#242424] pt-7.5 pb-12">
                Your Orders
            </div>

            <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {orders.length > 0 ? (
                <div className="flex flex-col gap-6">
                    {orders.map((order) =>
                        order.Items.map((item) => (
                            <div key={item.OrderItemId} className="border rounded-md p-4">
                                <div className="flex">
                                    <img
                                        src="/images/product/Rectangle984.svg"
                                        alt="Product Image"
                                        className="object-cover w-[131px] h-[131px] rounded-md overflow-hidden"
                                    />
                                    <div className="flex flex-col pl-2.5">
                                        <div className="xl:w-[448px] flex justify-between items-center">
                                            <span className="text-sm text-[#000] xl:text-lg font-normal leading-7">
                                                {item.ProductName}
                                            </span>
                                            <div className="rounded-[33px] p-1.5 bg-[#f7f7f7] flex items-center justify-center">
                                                <span className="text-[#272727] text-xs font-normal leading-6 tracking-[-0.2px]">
                                                    Order Id:
                                                </span>
                                                <span className="ml-1 text-[#272727] text-xs font-normal leading-6 tracking-[-0.2px]">
                                                    {order.OrderId}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex-col xl:flex-row xl:w-[448px] mt-[14px] flex justify-between items-center">
                                            <div className="w-[230px] flex items-center">
                                                <span className="text-[#272727] text-base font-medium leading-6 tracking-[-0.2px]">
                                                    Date Of Order:
                                                </span>
                                                <span className="ml-1 text-[#272727] text-base font-semibold leading-6 tracking-[-0.2px]">
                                                    {formatDate(order.CreatedAt)}
                                                </span>
                                            </div>

                                            <div className=" w-[230px] flex items-center">
                                                <span className="text-[#272727] text-base font-medium leading-6 tracking-[-0.2px]">
                                                    Total Amount Paid:
                                                </span>
                                                <span className="ml-1 text-base text-[#000] font-semibold">
                                                    {item.Price}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-[#242424] mt-6.5">
                                            <span className="text-[#0075FF] italic underline text-base font-medium leading-6 tracking-[-0.2px]">
                                              {/**   Uploaded Design*/}
                                            </span>

                                            {!expandedItems[item.OrderItemId] ? (
                                                <div
                                                    className="rounded-[4px] border border-[#000] px-2 py-1 cursor-pointer text-sm font-medium underline"
                                                    onClick={() => toggleExpand(item.OrderItemId)}
                                                >
                                                    View Order Details
                                                </div>
                                            ) : (
                                                <div
                                                    className="rounded-[4px] border border-[#000] px-2 py-1 cursor-pointer text-sm font-medium underline"
                                                    onClick={() => toggleExpand(item.OrderItemId)}
                                                >
                                                    Close Order Details
                                                </div>
                                            )}
                                        </div>

                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={expandedItems[item.OrderItemId] ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                                            transition={{ duration: 0.5, ease: "easeInOut" }}
                                            className="overflow-hidden mt-3"
                                        >
                                            <div className="flex flex-col gap-2">
                                                {item.Attributes.map((attr) => (
                                                    <div key={attr.OrderItemAttributeId} className="text-[#242424]">
                                                        <span className="text-base font-medium">{attr.AttributeName}:</span>{" "}
                                                        <span className="text-base">{attr.AttributeValue}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <p>No orders found.</p>
            )}
        </div>
    </div>

    );
};

export default UserProfileOrder;
