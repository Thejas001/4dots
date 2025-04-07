import { useEffect, useState } from "react";

const PopupModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Open the modal when the page loads
    setIsOpen(true);
  }, []);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-7.5 rounded-lg shadow-lg w-[452px]">
            <div className="flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 9C13.933 9 15.5 7.433 15.5 5.5C15.5 3.567 13.933 2 12 2C10.067 2 8.5 3.567 8.5 5.5C8.5 7.433 10.067 9 12 9Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2 20.5C2 16.0815 6.0295 12.5 11 12.5M15.5 21L20.5 16L18.5 14L13.5 19V21H15.5Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
              </span>
              <span className="text-lg font-medium text-[#000] text-center  mb-5">
                    What would you like us to call you?
              </span>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-base font-normal text-[#000]">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-base font-normal text-[#000]">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#242424] text-white py-2 rounded-[38px] text-center"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PopupModal;
