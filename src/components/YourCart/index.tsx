"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import DeliveryOption from "./DeliveryOption";
import AddressOption from "./AddressOption";
import PaymentCal from "./PaymentCal";
import { fetchCartItems , deleteCartItem } from "@/utils/cart"; //api
import { getUserDetails } from "@/utils/api"; //api

import { CartData } from "@/app/models/CartItems"; //model
import { processPendingCartItem } from "@/utils/processPendingCartItem";
import PopupModal from "../PopUpModal";


const Cart = () => {
  const [selectedOption, setSelectedOption] = useState(""); // State lifted to parent
  const [cartData, setCartData] = useState<CartData>({ Items: [], TotalPrice: 0 });
  const userId = 3; // Replace with actual user ID
  const router = useRouter(); // ✅ Define router here
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDetails = await getUserDetails();
        setUser(userDetails);

        if (!userDetails.Name || userDetails.Name.trim() === "") {
          setShowModal(true);
        }
      } catch (error) {
        console.error("Could not fetch user details", error);
        setShowModal(true); // optionally show modal on error
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      processPendingCartItem(setCartData);
    }
  }, []);
  

  useEffect(() => {
    const loadCartItems = async () => {
      const data = await fetchCartItems();
      console.log("Cart Data:", data); // Debugging output
      setCartData(data);
    };
    loadCartItems();
  },[]);

  useEffect(() => {
    console.log("Updated Cart Data in State:", cartData);
  }, [cartData]);
  

  const handleDelete = async (cartItemId: number) => {
    const success = await deleteCartItem(cartItemId);
    if (success) {
      setCartData(prevCart => ({
        ...prevCart,
        Items: prevCart.Items.filter(item => item.CartItemId !== cartItemId),
      }));
  
      // ✅ Wait 200ms before refetching the cart from the backend
      setTimeout(async () => {
        const updatedCart = await fetchCartItems();
        setCartData(updatedCart); // ✅ Ensure the backend's latest price is used
      }, 200);
    }
  };
  
  const cartItemIds = cartData.Items.map(item => item.CartItemId);

  return (
  <div className="h-auto grid grid-rows-[auto,1fr]  bg-[#fff]">
    {showModal && <PopupModal />}
    {/* Top Section */} 
    <div className="flex items-center mt-4 gap-[33.5px] px-20">
      {/* Back Button */}
      <div className="border rounded-[4px] border-[#242424] p-1">
        <Link href="/">
          <div className="text-gray-600 hover:text-gray-900 cursor-pointer">
            <img
              src="/images/icon/Arrow-icon.svg"
              alt="Back"
              className="w-4 h-4"
            />
          </div>
        </Link>
      </div>
  
      {/* Your Cart Text */}
      <span className="text-[#000] text-[22px] font-normal leading-[26px]">
        Your Cart
      </span>
    </div>
  
    {/* Bottom Section */}
    <div className="grid h-auto grid-cols-12 xl:grid-cols-2 pl-36 mt-9 ">
      {cartData.Items.length > 0 ? (
       <> 
      <div className="flex flex-col  ">
         {cartData.Items.map((item) => {
           const document = item.Documents?.[0];
           const isPdf = document?.ContentType === "application/pdf";
           const imageUrl = isPdf ? "/images/product/pdf.png" : document?.DocumentUrl;
           return (
          <div 
          key={item.CartItemId}
          className="flex rounded-[10px] border border-[#ECECEC] pr-2.5 mb-4 col-span-12 xl:col-span-1">
        <div className="flex">
          <img
            src="/images/product/pdf.png"
            alt="Product Image"
            className="mt-5 w-35 h-35 object-cover"
          />
        </div>
        <div className="flex flex-col flex-1">
          <div className="mt-2.5 xl:w-[448px] flex items-center">
            <span className="text-sm text-[#000] xl:text-lg font-normal leading-7 flex-grow">
            {item.ProductName}
            </span>

            {/**Delete Button*/}
            <div onClick={() => handleDelete(item.CartItemId)}  className="flex-shrink-0 ml-8 rounded-[33px] p-1.5 bg-[#ECECEC;] cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.2075 5.99758L11.7475 1.45758C12.0775 1.12758 12.0775 0.577578 11.7475 0.247578C11.5861 0.0889116 11.3688 0 11.1425 0C10.9162 0 10.6989 0.0889116 10.5375 0.247578L5.9975 4.78758L1.4575 0.247578C1.2961 0.0889116 1.07883 0 0.8525 0C0.626171 0 0.4089 0.0889116 0.2475 0.247578C-0.0825 0.577578 -0.0825 1.12758 0.2475 1.45758L4.7875 5.99758L0.2475 10.5376C-0.0825 10.8676 -0.0825 11.4176 0.2475 11.7476C0.5775 12.0776 1.1275 12.0776 1.4575 11.7476L5.9975 7.20758L10.5375 11.7476C10.8675 12.0776 11.4175 12.0776 11.7475 11.7476C12.0775 11.4176 12.0775 10.8676 11.7475 10.5376L7.2075 5.99758Z"
                  fill="#242424"
                />
              </svg>
            </div>
          </div>

          <div className="flex items-center text-[#242424] mt-8 gap-7.5">
            {/* Selected Size */}
            <span className="text-base font-medium leading-6 tracking-[-0.2px]">
              <span>Selected Size:</span>
              <span className="pl-[9px]">20 x 30 cm</span>
            </span>

            {/* Color */}
            <span className="flex items-center text-[#000] pl-2">
              <span className="text-[#242424]">Color:</span>
              <div
                className="w-6.5 h-6.5 rounded-[32px] bg-black inline-block mx-2 border border-gray-300 gap-3"
                style={{ borderColor: "#ECECEC" }}
              ></div>
              Black
            </span>
          </div>

          <div className="flex items-center text-[#242424] mt-3">
            <span className="text-base font-medium leading-6 tracking-[-0.2px]">
              <span>Quantity :</span>
              <span className="pl-[9px]">1 pcs</span>
            </span>
            <span className="text-[#0075FF] italic underline text-base font-medium ml-7.5 leading-6 tracking-[-0.2px]">
              Uploaded Design
            </span>
            <span className="ml-2.5 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.95153 1.04199L11.2493 1.04199C11.5945 1.04199 11.8743 1.32181 11.8743 1.66699C11.8743 2.01217 11.5945 2.29199 11.2493 2.29199H9.99935C8.01749 2.29199 6.59398 2.29332 5.51066 2.43897C4.44533 2.5822 3.80306 2.85461 3.32835 3.32932C2.85363 3.80404 2.58122 4.4463 2.43799 5.51164C2.29234 6.59495 2.29102 8.01847 2.29102 10.0003C2.29102 11.9822 2.29234 13.4057 2.43799 14.489C2.58122 15.5543 2.85363 16.1966 3.32835 16.6713C3.80306 17.146 4.44533 17.4185 5.51066 17.5617C6.59398 17.7073 8.01749 17.7087 9.99935 17.7087C11.9812 17.7087 13.4047 17.7073 14.488 17.5617C15.5534 17.4185 16.1956 17.146 16.6704 16.6713C17.1451 16.1966 17.4175 15.5543 17.5607 14.489C17.7064 13.4057 17.7077 11.9822 17.7077 10.0003V8.75033C17.7077 8.40515 17.9875 8.12533 18.3327 8.12533C18.6779 8.12533 18.9577 8.40515 18.9577 8.75033V10.0481C18.9577 11.9718 18.9577 13.4793 18.7996 14.6556C18.6377 15.8595 18.2999 16.8095 17.5542 17.5552C16.8086 18.3009 15.8585 18.6387 14.6546 18.8005C13.4784 18.9587 11.9708 18.9587 10.0472 18.9587H9.95154C8.02788 18.9587 6.52034 18.9587 5.3441 18.8005C4.14016 18.6387 3.19014 18.3009 2.44446 17.5552C1.69879 16.8095 1.361 15.8595 1.19914 14.6556C1.041 13.4793 1.04101 11.9718 1.04102 10.0481V9.95251C1.04101 8.02885 1.041 6.52132 1.19914 5.34508C1.361 4.14113 1.69879 3.19111 2.44446 2.44544C3.19014 1.69976 4.14016 1.36198 5.3441 1.20011C6.52034 1.04197 8.02787 1.04198 9.95153 1.04199ZM13.9748 1.89692C15.1147 0.757016 16.9628 0.757016 18.1028 1.89692C19.2427 3.03683 19.2427 4.88498 18.1028 6.02488L12.5627 11.565C12.2533 11.8744 12.0595 12.0683 11.8432 12.237C11.5884 12.4356 11.3128 12.606 11.0211 12.745C10.7735 12.863 10.5135 12.9497 10.0983 13.088L7.6779 13.8948C7.23103 14.0438 6.73835 13.9275 6.40528 13.5944C6.0722 13.2613 5.95589 12.7686 6.10485 12.3218L6.91166 9.90135C7.05001 9.48621 7.13667 9.22615 7.25468 8.97853C7.39367 8.68689 7.56402 8.41125 7.76272 8.15651C7.93142 7.94022 8.12527 7.7464 8.43472 7.43699L13.9748 1.89692ZM17.2189 2.7808C16.5671 2.12906 15.5104 2.12906 14.8587 2.7808L14.5448 3.09466C14.5637 3.17454 14.5902 3.26972 14.627 3.37588C14.7465 3.72009 14.9725 4.17342 15.3994 4.60032C15.8263 5.02722 16.2796 5.25321 16.6238 5.37263C16.73 5.40947 16.8251 5.43593 16.905 5.45485L17.2189 5.141C17.8706 4.48925 17.8706 3.43255 17.2189 2.7808ZM15.9203 6.43957C15.4903 6.25465 14.9895 5.95821 14.5155 5.4842C14.0415 5.0102 13.745 4.50934 13.5601 4.07937L9.34727 8.29221C9.00018 8.6393 8.86405 8.77695 8.74836 8.92528C8.6055 9.10844 8.48302 9.30662 8.38308 9.51631C8.30215 9.68612 8.23991 9.86944 8.08469 10.3351L7.72477 11.4149L8.58482 12.2749L9.66456 11.915C10.1302 11.7598 10.3136 11.6975 10.4834 11.6166C10.6931 11.5167 10.8912 11.3942 11.0744 11.2513C11.2227 11.1356 11.3604 10.9995 11.7075 10.6524L15.9203 6.43957Z" fill="#0075FF"/>
              </svg>
            </span>
          </div>

          <div className="flex items-center text-[#242424] mt-[27px]">
            <span className="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M12.75 4.5V3H4.5V4.5H7.125C8.1015 4.5 8.92575 5.1285 9.23625 6H4.5V7.5H9.23625C9.08267 7.93767 8.79717 8.31695 8.41905 8.58559C8.04094 8.85423 7.58883 8.99901 7.125 9H4.5V10.8105L8.6895 15H10.8105L6.3105 10.5H7.125C7.98886 10.4984 8.82579 10.1992 9.49488 9.65282C10.164 9.1064 10.6243 8.34612 10.7985 7.5H12.75V6H10.7985C10.6844 5.45388 10.4474 4.94091 10.1055 4.5H12.75Z"
                  fill="#242424"
                />
              </svg>
            </span>
            <span className="text-lg text-[#242424] font-semibold leading-6 tracking-tighter-[-0.2px]">
            {item.ItemPrice}
            </span>
          </div>
        </div>
      </div>
        );
})}
  </div>
        <div className="col-span-12 xl:col-span-1 ml-6 mr-20">
        <DeliveryOption selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
        {selectedOption === "delivery" && <AddressOption />}
        <PaymentCal totalPrice={cartData.TotalPrice}  userId={userId} cartItemIds={cartItemIds} />
        </div>
        </>
      ) : (
        <div className="col-span-12 text-center">
          <p className="text-gray-500 text-lg font-medium">Your cart is empty.</p>
        </div>
      )}
    </div>
  </div>
  );
};

export default Cart;