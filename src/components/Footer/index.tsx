import React from 'react';

const Footer = () => {
    return (
        <footer className="bottom-0 w-full min-h-[100px] md:max-h-[390px] bg-[#242424] py-15 md:py-[110px] text-[#FCFCFC] relative">
        <div className="absolute bottom-0 -left-1.5">
            <img src="/images/icon/column-vector.svg" alt="left column icon" />
        </div>
        <div className="absolute -top-2 right-0">
            <img src="/images/icon/rightcolumn-vector.svg" alt="right column icon" />
        </div>
    
        {/* Wrapper for alignment */}
        <div className="container mx-auto flex flex-col sm:flex-row px-6 md:px-16">
            
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
                <p className="text-base text-[#9CA3AF] mt-5">© domain.com - All rights reserved.</p>
                <div className="flex gap-4 mt-11">
                    {/* Social icons */}
                    <span className="h-5 w-5 flex items-center justify-center" aria-label="Social Icon 1">
                        <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path d="M5.063 0L8.558 4.475L12.601 0H15.055L9.696 5.931L16 14H11.062L7.196 9.107L2.771 14H0.316L6.051 7.658L0 0H5.063ZM4.323 1.347H2.866L11.741 12.579H13.101L4.323 1.347Z" fill="#9CA3AF"/>
                        </svg>
                    </span>
                    <span className="h-5 w-5 flex items-center justify-center" aria-label="Social Icon 2">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.29 6.3C4.17219 6.20392 4.02595 6.14943 3.874 6.145H3.251V9.872H3.874C4.02609 9.86736 4.17236 9.81251 4.29 9.716C4.36057 9.66153 4.41664 9.59053 4.45326 9.50925C4.48988 9.42798 4.50594 9.33894 4.5 9.25V6.762C4.50492 6.67376 4.48839 6.58563 4.45182 6.50517C4.41525 6.42471 4.35972 6.35431 4.29 6.3ZM14.432 0H1.568C0.704 0 0.002 0.7 0 1.564V14.436C0.0010591 14.8512 0.166726 15.249 0.460669 15.5422C0.754611 15.8354 1.15283 16 1.568 16H14.432C15.296 16 15.998 15.3 16 14.436V1.564C15.9989 1.14883 15.8333 0.751034 15.5393 0.457842C15.2454 0.164649 14.8472 -1.35089e-06 14.432 0ZM5.507 9.257C5.51521 9.48417 5.47584 9.71056 5.39141 9.92162C5.30699 10.1327 5.17938 10.3238 5.01676 10.4826C4.85415 10.6415 4.66013 10.7646 4.44714 10.844C4.23416 10.9235 4.00692 10.9575 3.78 10.944H2.123V5.035H3.815C4.03923 5.02646 4.26282 5.06428 4.47176 5.1461C4.68071 5.22792 4.87053 5.35197 5.02934 5.5105C5.18815 5.66904 5.31255 5.85863 5.39473 6.06743C5.47692 6.27624 5.51514 6.49975 5.507 6.724V9.257ZM9.1 6.09H7.2V7.462H8.363V8.519H7.2V9.89H9.1V10.946H6.883C6.78844 10.9487 6.69428 10.9327 6.6059 10.8989C6.51753 10.8652 6.43667 10.8144 6.36795 10.7493C6.29922 10.6843 6.24398 10.6064 6.20539 10.5201C6.16679 10.4337 6.14559 10.3406 6.143 10.246V5.775C6.13816 5.58427 6.20911 5.39939 6.34032 5.26088C6.47153 5.12236 6.65229 5.0415 6.843 5.036H9.1V6.09ZM12.8 10.208C12.329 11.308 11.484 11.088 11.106 10.208L9.734 5.036H10.9L11.958 9.1L13.014 5.038H14.178L12.8 10.208Z" fill="#9CA3AF"/>
                        </svg>
                    </span>
                    <span className="h-5 w-5 flex items-center justify-center" aria-label="Social Icon 3">
                        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 0.199951C3.6 0.199951 0 3.79995 0 8.19995C0 11.7 2.3 14.7 5.5 15.8C5.9 15.9 6 15.6 6 15.4V14C3.8 14.5 3.3 13 3.3 13C2.9 12.1 2.4 11.8 2.4 11.8C1.7 11.3 2.5 11.3 2.5 11.3C3.3 11.4 3.7 12.1 3.7 12.1C4.4 13.4 5.6 13 6 12.8C6.1 12.3 6.3 11.9 6.5 11.7C4.7 11.5 2.9 10.8 2.9 7.69995C2.9 6.79995 3.2 6.09995 3.7 5.59995C3.6 5.39995 3.3 4.59995 3.8 3.49995C3.8 3.49995 4.5 3.29995 6 4.29995C6.6 4.09995 7.3 3.99995 8 3.99995C8.7 3.99995 9.4 4.09995 10 4.29995C11.5 3.29995 12.2 3.49995 12.2 3.49995C12.6 4.59995 12.4 5.39995 12.3 5.59995C12.8 6.19995 13.1 6.89995 13.1 7.69995C13.1 10.8 11.2 11.4 9.4 11.6C9.7 12 10 12.5 10 13.2V15.4C10 15.6 10.1 15.9 10.6 15.8C13.8 14.7 16.1 11.7 16.1 8.19995C16 3.79995 12.4 0.199951 8 0.199951Z" fill="#9CA3AF"/>
                        </svg>
                    </span>
                </div>
            </div>
    
            {/* Right Section (Links) */}
            <div className="flex flex-col items-start md:ml-150 sm:flex-row gap-y-6 sm:gap-x-20 sm:w-auto mt-10 sm:mt-0">
                {/* First Row */}
                <div className=''>
                    <h4 className="text-lg font-bold mb-3">Company</h4>
                    <ul className="space-y-3 text-base text-[#9CA3AF]">
                        <li>About Us</li>
                        <li>Our Story</li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>
    

    );
};

export default Footer;