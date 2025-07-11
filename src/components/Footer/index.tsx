import React from 'react';
import Link from 'next/link';
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FiPhone, FiInfo, FiBookOpen, FiRefreshCw, FiTruck, FiUsers } from "react-icons/fi";

const companyLinks = [
  {
    href: "/about-us",
    label: "About Us",
    icon: <FiInfo className="text-lg" />,
  },
  {
    href: "/our-story",
    label: "Our Story",
    icon: <FiUsers className="text-lg" />,
  },
  {
    href: "/terms-and-conditions",
    label: "Terms and Conditions",
    icon: <FiBookOpen className="text-lg" />,
  },
  {
    href: "/cancellation-refund",
    label: "Cancellation & Refund",
    icon: <FiRefreshCw className="text-lg" />,
  },
  {
    href: "/shipping-delivery",
    label: "Shipping & Delivery",
    icon: <FiTruck className="text-lg" />,
  },
];

const Footer = () => {
    return (
        <footer className="bottom-0 w-full min-h-[100px] md:max-h-[390px] bg-[#242424] py-15 md:py-[110px] text-[#FCFCFC] relative">
        <div className="absolute bottom-0 -left-1.5 pointer-events-none">
            <img src="/images/icon/column-vector.svg" alt="left column icon" />
        </div>
        <div className="absolute -top-2 right-0 pointer-events-none">
            <img src="/images/icon/rightcolumn-vector.svg" alt="right column icon" />
        </div>
    
        {/* Wrapper for alignment */}
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-start px-6 md:px-16 gap-y-10 sm:gap-y-0">
            {/* Left Section */}
            <div className="flex flex-col items-start sm:w-auto">
                <div className="mb-4.5 flex flex-col items-start">
                    <div className="flex gap-3 mb-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="99" height="12" viewBox="0 0 99 12" fill="none">
                            <circle cx="5.73256" cy="5.73256" r="5.73256" fill="#0093D3"/>
                            <circle cx="34.7326" cy="5.73256" r="5.73256" fill="#CC016B"/>
                            <circle cx="63.7326" cy="5.73256" r="5.73256" fill="#FFF10D"/>
                            <circle cx="92.7326" cy="5.73256" r="5.73256" fill="black"/>
                        </svg>
                    </div>
                    <div className="flex font-semibold text-[32px] font-sans mt-1.5">
                        <span className="ml-0.5">4</span>
                        <span className="ml-2">D</span>
                        <span>o</span>
                        <span>t</span>
                        <span>s</span>
                    </div>
                </div>
                <p className="text-base text-[#9CA3AF] mt-5">© 2025 4 Dots. All rights reserved.</p>
                <p className="text-base text-[#9CA3AF] mt-1">
                  Developed by{' '}
                  <a
                    href="https://asimovx.se/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-400"
                  >
                    Asimovx Technologies AB
                  </a>
                </p>
                <div className="flex gap-4 mt-11">
                    {/* Social icons */}
                    <a
                      href="https://www.instagram.com/4dotsprintinghub?igsh=MXU4aWRheXJiNGZmMg=="
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="text-3xl cursor-pointer"
                    >
                      <FaInstagram />
                    </a>
                    <a
                      href="https://www.facebook.com/share/1AbKUK1BTb/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="text-3xl cursor-pointer"
                    >
                      <FaFacebook />
                    </a>
                </div>
            </div>

            {/* Center Section: Contact Us */}
            <div className="flex flex-col items-start justify-center w-full sm:w-auto my-8 sm:my-0">
              <h4 className="text-lg font-bold mb-3 text-center">Contact Us</h4>
              <div className="flex flex-col items-start gap-y-3">
                <a href="mailto:4dotsclt@gmail.com" className="flex items-center gap-2 text-[#9CA3AF] hover:text-blue-400 text-base cursor-pointer transition-colors duration-200">
                  <MdEmail className="text-xl" />
                  4dotsclt@gmail.com
                </a>
                <a href="tel:+919037061189" className="flex items-center gap-2 text-[#9CA3AF] hover:text-blue-400 text-base cursor-pointer transition-colors duration-200">
                  <FiPhone className="text-xl" />
                  +91 9037061189
                </a>
              </div>
            </div>
    
            {/* Right Section (Company Links) */}
            <div className="flex flex-col items-start gap-y-6 sm:w-auto mt-10 sm:mt-0">
                {/* Company Section */}
                <div className=''>
                    <h4 className="text-lg font-bold mb-3">Company</h4>
                    <ul className="space-y-3 text-base text-[#9CA3AF]">
                      {companyLinks.map((item, idx) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="flex items-center gap-2 group font-semibold transition-transform duration-200 hover:translate-x-1 hover:text-blue-400"
                          >
                            <span className="transition-colors duration-200 group-hover:text-blue-400">{item.icon}</span>
                            <span>{item.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                </div>
            </div>
        </div>
    </footer>
    

    );
};

export default Footer;