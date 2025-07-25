"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

interface CustomerDetails {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  profileImage: string;
}

const CustomerProfilePage = () => {
  const [data, setData] = useState<CustomerDetails | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get(
          "https://printdot.in/api/Account/customer-details",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching customer details:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          {/* Left Section */}
          <div className="w-full md:w-1/3 bg-blue-600 text-white p-6 flex flex-col items-center justify-center">
            {/* Mobile View - Pic and Name side by side */}
            <div className="md:hidden flex items-center gap-3 justify-center">
              <Image
                src={data?.profileImage || "/default-profile.png"}
                width={60}
                height={60}
                alt="Profile"
                className="rounded-full object-cover"
              />
              <p className="text-lg font-semibold">{data?.name}</p>
            </div>

            {/* Desktop View - Pic then Name */}
            <div className="hidden md:flex flex-col items-center">
              <Image
                src={data?.profileImage || "/default-profile.png"}
                width={80}
                height={80}
                alt="Profile"
                className="rounded-full object-cover mb-3"
              />
              <p className="text-xl font-bold">{data?.name}</p>
            </div>

            <p className="mt-1 text-sm opacity-80">{data?.email}</p>
            <p className="text-sm opacity-80">{data?.phoneNumber}</p>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-2/3 p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Account Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Name
                </label>
                <p className="text-gray-800">{data?.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <p className="text-gray-800">{data?.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Phone Number
                </label>
                <p className="text-gray-800">{data?.phoneNumber}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Address
                </label>
                <p className="text-gray-800">{data?.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfilePage;
