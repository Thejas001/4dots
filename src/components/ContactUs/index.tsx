import React from "react";
import DefaultLayout from "../Layouts/DefaultLayout";

const ContactUs = () => {
    return (
      <div className="px-[25px] md:px-20 bg-[#fff]">
      <div className="bg-gradient-to-r from-[#FFFDE3] to-[#FFEDF6] h-auto px-4 py-6 md:px-0 md:py-0 md:h-[465px] md:w-full rounded-[20px] border border-[#ECECEC] shadow-md flex flex-col md:flex-row justify-between items-center">
        
        {/* Left Section */}
        <div className="flex-1 md:pl-[92px]">
          <h2 className="text-xl leading-[30px] tracking-[-0.5px] md:text-5xl font-bold text-[#1C274C]">Contact Us</h2>
          <p className="text-gray-[#647488] text-base max-w-[500px] mt-2">
            Whether you have a question, feedback, or need assistance, our team is here to help.
          </p>
          <div className="space-y-2.5 mt-11.5 md:mt-25 text-sm md:text-base">
            <p className="text-black"> 
              <span className="text-[#647488]">Email Us: </span>{' '}
              <a href="mailto:support@sphereplatforms.com" className="font-semibold underline">
                support@sphereplatforms.com
              </a>
            </p>
            <p className="text-black ">
              <span className="text-[#647488]">Phone:</span>{' '}
              <span className='font-semibold'>+1 (555) 123-4567</span>
            </p>
            <p className="text-black">
              <span className="text-[#647488]">Address:</span>{' '}
              <span className='font-normal'>1234 Example St., City, Country</span>
            </p>
          </div>
          <p className="text-[#647488] max-w-[500px] text-sm font-normal mt-5">
            Our customer support team will get back to you within 3–5 business days.
          </p>
        </div>

        {/* Right Section */}
        <div className="w-full md:flex-1 flex mt-[75px] md:mt-0">
          <form className="space-y-4 w-full md:max-w-[507px]">
            <div>
              <label htmlFor="email" className="block text-[#242424] text-base">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full h-11 mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="feedback" className="block text-[#242424] text-base">
                Feedback
              </label>
              <textarea
                id="feedback"
                placeholder="Enter your feedback"
                maxLength={100}
                rows={6}
                className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none text-[#BBBEC9]"
              />
              <div className="text-right text-[#8D93A5] text-sm">0/100</div>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-[214px]  md:max-w-[305px] bg-[#242424] text-[#fff] py-2 px-4 rounded-full"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    ); 
};
export default ContactUs;