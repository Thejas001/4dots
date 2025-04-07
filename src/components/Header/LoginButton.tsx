import React, { useEffect, useState } from "react";
import Link from "next/link";

const LoginButton = () => { 

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken"); // Check if the user has a token
    setIsLoggedIn(!!token); // Convert token existence to boolean
  }, []); 

    return(
      <Link href={isLoggedIn ? "/profile" : "/auth/signin"}>
        <div className="flex items-center bg-[#ECECEC] border border-[#B5B5B5] rounded-full w-[84px] h-8 ml-0 px-1 py-2 cursor-pointer">
          
          <div className="bg-black text-white rounded-full w-7 h-7 flex items-center justify-center">
            RR
          </div>
          <span className="text-[#242424] w-[40px] h-[21px] text-sm font-medium pl-2">
           {isLoggedIn ? "Profile" : "Login"}
          </span>
          
          
        </div>
        </Link>
    );
};

export default LoginButton;
