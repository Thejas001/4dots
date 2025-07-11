import react from "react";

type ProgressBarProps = {
  orderStatus: string;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ orderStatus }) => {
  return (
    <div className="sticky top-0 ml-12 mt-9">
      {/* Progress Bar */}
      <div className="mx-4 flex flex-col items-start space-y-4">
        {/* Progress Steps */}
        <div className="flex flex-col items-center">
          {/* Step 1: Order Placed */}
          <div className="flex flex-col items-center">
            <div
              className={`relative rounded-full border border-[#000] h-[30px] w-[30px] flex items-center justify-center ${orderStatus === "Shipped" || orderStatus === "InProgress" || orderStatus === "Delivered" ? "border-[#000]" : "border-gray-300"} transition duration-500 ease-in-out`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M3.66022 12.7201V5.92653L2.52614 3.43301C2.4876 3.34375 2.48614 3.24936 2.52175 3.14986C2.55735 3.05035 2.61979 2.98084 2.70905 2.94133C2.79832 2.90182 2.89294 2.89987 2.99294 2.93548C3.09293 2.97109 3.16195 3.03279 3.2 3.12059L4.45335 5.88995H13.1104L14.3638 3.12132C14.4023 3.03206 14.4713 2.96962 14.5708 2.93401C14.6708 2.89841 14.7655 2.90109 14.8547 2.94206C14.944 2.9806 15.0064 3.04986 15.042 3.14986C15.0776 3.24985 15.0762 3.34424 15.0376 3.43301L13.9036 5.92653V12.7201C13.9036 13.0469 13.7884 13.3256 13.5582 13.5564C13.328 13.7866 13.0492 13.9017 12.7219 13.9017H4.84186C4.51505 13.9017 4.23628 13.7866 4.00557 13.5564C3.77533 13.3261 3.66022 13.0474 3.66022 12.7201ZM7.31855 9.14586H10.2452C10.3496 9.14586 10.4367 9.11099 10.5064 9.04124C10.5762 8.97148 10.6111 8.88442 10.6111 8.78003C10.6111 8.67565 10.5762 8.58858 10.5064 8.51883C10.4367 8.44907 10.3496 8.4142 10.2452 8.4142H7.31855C7.21465 8.4142 7.12759 8.44907 7.05735 8.51883C6.98711 8.58858 6.95223 8.67565 6.95272 8.78003C6.95321 8.88442 6.98808 8.97148 7.05735 9.04124C7.12661 9.11099 7.21368 9.14586 7.31855 9.14586ZM4.84259 13.17H12.7219C12.8531 13.17 12.9609 13.1278 13.0453 13.0435C13.1297 12.9591 13.1719 12.8513 13.1719 12.7201V6.62161H4.39189V12.7201C4.39189 12.8513 4.43408 12.9591 4.51846 13.0435C4.60285 13.1278 4.71089 13.17 4.84259 13.17Z"
                  fill={
                    orderStatus === "Shipped" ||
                    orderStatus === "InProgress" ||
                    orderStatus === "Delivered"
                      ? "black"
                      : "#B5B5B5"
                  }
                />
                <path
                   d="M4.39189 6.62161H13.1719V12.7201C13.1719 12.8513 13.1297 12.9591 13.0453 13.0435C12.9609 13.1278 12.8531 13.17 12.7219 13.17H4.84259C4.71089 13.17 4.60285 13.1278 4.51846 13.0435C4.43408 12.9591 4.39189 12.8513 4.39189 12.7201V6.62161ZM4.39189 6.62161V13.17M3.66022 12.7201V5.92653L2.52614 3.43301C2.4876 3.34375 2.48614 3.24936 2.52175 3.14986C2.55735 3.05035 2.61979 2.98084 2.70905 2.94133C2.79832 2.90182 2.89294 2.89987 2.99294 2.93548C3.09293 2.97109 3.16195 3.03279 3.2 3.12059L4.45335 5.88995H13.1104L14.3638 3.12132C14.4023 3.03206 14.4713 2.96962 14.5708 2.93401C14.6708 2.89841 14.7655 2.90109 14.8547 2.94206C14.944 2.9806 15.0064 3.04986 15.042 3.14986C15.0776 3.24985 15.0762 3.34424 15.0376 3.43301L13.9036 5.92653V12.7201C13.9036 13.0469 13.7884 13.3256 13.5582 13.5564C13.328 13.7866 13.0492 13.9017 12.7219 13.9017H4.84186C4.51505 13.9017 4.23628 13.7866 4.00557 13.5564C3.77533 13.3261 3.66022 13.0474 3.66022 12.7201ZM7.31855 9.14586H10.2452C10.3496 9.14586 10.4367 9.11099 10.5064 9.04124C10.5762 8.97148 10.6111 8.88442 10.6111 8.78003C10.6111 8.67565 10.5762 8.58858 10.5064 8.51883C10.4367 8.44907 10.3496 8.4142 10.2452 8.4142H7.31855C7.21466 8.4142 7.12759 8.44907 7.05735 8.51883C6.98711 8.58858 6.95223 8.67565 6.95272 8.78003C6.95321 8.88442 6.98808 8.97148 7.05735 9.04124C7.12661 9.11099 7.21368 9.14586 7.31855 9.14586Z"                  stroke={
                    orderStatus === "Shipped" ||
                    orderStatus === "InProgress" ||
                    orderStatus === "Delivered"
                      ? "black"
                      : "#B5B5B5"
                  }
                  stroke-width="0.5"
                />
              </svg>
            </div>
            <div
              className={`mt-2 text-center w-32 text-[11px] font-normal leading-6 tracking-[-0.2px] text-[#242424] ${orderStatus === "Shipped" || orderStatus === "InProgress" || orderStatus === "Delivered" ? "text-[#242424]" : "text-[#B5B5B5]"}`}
            >
              Order Placed
            </div>
          </div>

          {/* Divider */}
          <div
            className={`h-[80px] w-[2px] ${orderStatus === "Shipped" || orderStatus === "InProgress" || orderStatus === "Delivered" ? "bg-[#242424]" : "bg-gray-300"}`}
          ></div>

          {/* Step 2: Printing Started */}
          <div className="flex flex-col items-center mx-1.5">
            <div
              className={`relative rounded-full border border-[#000] h-[30px] w-[30px] flex items-center justify-center ${orderStatus === "Shipped" || orderStatus === "InProgress" || orderStatus === "Delivered" ? "border-[#000]" : "border-gray-300"} transition duration-500 ease-in-out`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 19 19"
                fill="none"
              >
                <path
                    d="M13.7588 13.2073H14.582C14.9455 13.2062 15.2938 13.0613 15.5509 12.8043C15.808 12.5472 15.9528 12.1989 15.9539 11.8353V6.34754C15.9528 5.98401 15.808 5.63568 15.5509 5.37862C15.2938 5.12156 14.9455 4.97667 14.582 4.97559H4.15515C3.79162 4.97667 3.44329 5.12156 3.18624 5.37862C2.92918 5.63568 2.78429 5.98401 2.7832 6.34754V11.8353C2.78429 12.1989 2.92918 12.5472 3.18624 12.8043C3.44329 13.0613 3.79162 13.2062 4.15515 13.2073H4.97833"                  
                    stroke={
                    orderStatus === "Shipped" ||
                    orderStatus === "InProgress" ||
                    orderStatus === "Delivered"
                      ? "black"
                      : "#B5B5B5"
                  }
                  stroke-width="0.731707"
                  stroke-linejoin="round"
                />

                <path
                  d="M12.9249 8.81689H5.81266C5.35198 8.81689 4.97852 9.19035 4.97852 9.65104V15.1169C4.97852 15.5776 5.35198 15.951 5.81266 15.951H12.9249C13.3855 15.951 13.759 15.5776 13.759 15.1169V9.65104C13.759 9.19035 13.3855 8.81689 12.9249 8.81689Z"
                  stroke={
                    orderStatus === "Shipped" ||
                    orderStatus === "InProgress" ||
                    orderStatus === "Delivered"
                      ? "black"
                      : "#B5B5B5"
                  }
                  stroke-width="0.731707"
                  stroke-linejoin="round"
                />

                <path
                    d="M13.759 4.9754V4.15222C13.7579 3.78869 13.613 3.44036 13.356 3.18331C13.0989 2.92625 12.7506 2.78136 12.3871 2.78027H6.35047C5.98694 2.78136 5.63861 2.92625 5.38155 3.18331C5.12449 3.44036 4.9796 3.78869 4.97852 4.15222V4.9754"                  stroke={
                    orderStatus === "Shipped" ||
                    orderStatus === "InProgress" ||
                    orderStatus === "Delivered"
                      ? "black"
                      : "#B5B5B5"
                  }
                  stroke-width="0.731707"
                  stroke-linejoin="round"
                />

                <path
                    d="M14.0341 7.71958C14.4887 7.71958 14.8573 7.35104 14.8573 6.89641C14.8573 6.44179 14.4887 6.07324 14.0341 6.07324C13.5795 6.07324 13.2109 6.44179 13.2109 6.89641C13.2109 7.35104 13.5795 7.71958 14.0341 7.71958Z"                  
                    stroke={
                    orderStatus === "Shipped" ||
                    orderStatus === "InProgress" ||
                    orderStatus === "Delivered"
                      ? "black"
                      : "#B5B5B5"
                  }
                />
              </svg>
            </div>
            <div
              className={`mt-2 text-center w-32 text-[11px] font-normal leading-6 tracking-[-0.2px] text-[#242424] ${orderStatus === "Shipped" || orderStatus === "InProgress" || orderStatus === "Delivered" ? "text-[#242424]" : "text-[#B5B5B5]"}`}
            >
              Printing Started
            </div>
          </div>

          {/* Divider */}
          <div
            className={`h-[80px] w-[2px] ${orderStatus === "Shipped" || orderStatus === "InProgress" || orderStatus === "Delivered" ? "bg-[#242424]" : "bg-gray-300"}`}
          ></div>

          {/* Step 3: Order Shipped */}
          <div className="flex flex-col items-center mx-1.5 text-gray-400">
            <div
              className={`relative rounded-full border border-gray-300 h-[30px] w-[30px] flex items-center justify-center ${orderStatus === "Shipped" || orderStatus === "Delivered" ? "border-[Black]" : "border-gray-300"} transition duration-500 ease-in-out`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 19 19"
                fill="none"
              >
                <path
                  d="M14.8565 13.3903C14.8565 13.8755 14.6637 14.3407 14.3207 14.6838C13.9776 15.0268 13.5124 15.2196 13.0272 15.2196C12.542 15.2196 12.0768 15.0268 11.7337 14.6838C11.3907 14.3407 11.1979 13.8755 11.1979 13.3903C11.1979 12.9052 11.3907 12.4399 11.7337 12.0968C12.0768 11.7538 12.542 11.561 13.0272 11.561C13.5124 11.561 13.9776 11.7538 14.3207 12.0968C14.6637 12.4399 14.8565 12.9052 14.8565 13.3903ZM7.5394 13.3903C7.5394 13.8755 7.34667 14.3407 7.00362 14.6838C6.66056 15.0268 6.19528 15.2196 5.71013 15.2196C5.22498 15.2196 4.75969 15.0268 4.41664 14.6838C4.07359 14.3407 3.88086 13.8755 3.88086 13.3903C3.88086 12.9052 4.07359 12.4399 4.41664 12.0968C4.75969 11.7538 5.22498 11.561 5.71013 11.561C6.19528 11.561 6.66056 11.7538 7.00362 12.0968C7.34667 12.4399 7.5394 12.9052 7.5394 13.3903Z"                  
                  stroke={
                    orderStatus === "Shipped" || orderStatus === "Delivered"
                      ? "black"
                      : "#B5B5B5"
                  }
                  stroke-width="1.09756"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />

                <path
                    d="M11.1971 13.3903H7.53859M2.05078 3.51221H9.36785C10.4025 3.51221 10.9198 3.51221 11.241 3.83416C11.563 4.15465 11.563 4.67196 11.563 5.70733V11.9268M11.9288 5.34148H13.2466C13.854 5.34148 14.1576 5.34148 14.4093 5.48416C14.661 5.62611 14.8169 5.8866 15.1293 6.40757L16.3725 8.4783C16.5276 8.73733 16.6052 8.86757 16.6454 9.01099C16.6849 9.15513 16.6849 9.30587 16.6849 9.60806V11.561C16.6849 12.2451 16.6849 12.5868 16.5379 12.8415C16.4415 13.0083 16.303 13.1469 16.1361 13.2432C15.8815 13.3903 15.5398 13.3903 14.8557 13.3903M2.05078 10.0976V11.561C2.05078 12.2451 2.05078 12.5868 2.19785 12.8415C2.29418 13.0083 2.43273 13.1469 2.59956 13.2432C2.8542 13.3903 3.1959 13.3903 3.88005 13.3903M2.05078 5.70733H6.44103M2.05078 7.90245H4.97761"                  stroke={
                    orderStatus === "Shipped" || orderStatus === "Delivered"
                      ? "black"
                      : "#B5B5B5"
                  }
                  stroke-width="1.09756"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div
              className={`mt-2 text-center w-32 text-[11px] font-normal leading-6 tracking-[-0.2px]  ${orderStatus === "Shipped" || orderStatus === "Delivered" ? "text-[#242424]" : "text-[#B5B5B5]"}`}
            >
              Order Shipped
            </div>
          </div>

          {/* Divider */}
          <div
            className={`h-[80px] w-[2px]  ${orderStatus === "Shipped" || orderStatus === "Delivered" ? "bg-[#242424]" : "bg-gray-300"}`}
          ></div>

          {/* Step 4: Out For Delivery */}
          <div className="flex flex-col items-center mx-1.5 text-gray-400">
            <div
              className={`relative rounded-full border border-gray-300 h-[30px] w-[30px] flex items-center justify-center ${orderStatus === "Delivered" ? "border-[Black]" : "border-gray-300"} transition duration-500 ease-in-out`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M15.3673 5.12158V8.77992M2.19727 5.12158V12.556C2.19727 13.5679 3.62109 14.1694 6.468 15.3715C7.6116 15.8551 8.18376 16.0966 8.78227 16.0966V8.30799M10.9773 13.9016C10.9773 13.9016 11.6175 13.9016 12.2577 15.3649C12.2577 15.3649 14.2917 11.7066 16.0989 10.9749"                   stroke={orderStatus === "Delivered" ? "black" : "#B5B5B5"}
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />

                <path
                  d="M4.39227 8.78005L5.8556 9.51171M12.4406 2.92671L5.12393 6.58505M6.09412 7.09063L3.95692 6.05678C2.78406 5.48901 2.19727 5.20512 2.19727 4.75588C2.19727 4.30664 2.78406 4.02275 3.95692 3.45498L6.09339 2.42113C7.41405 1.78239 8.07255 1.46338 8.78227 1.46338C9.49198 1.46338 10.1512 1.78239 11.4704 2.42113L13.6076 3.45498C14.7805 4.02275 15.3673 4.30664 15.3673 4.75588C15.3673 5.20512 14.7805 5.48901 13.6076 6.05678L11.4711 7.09063C10.1505 7.72937 9.49198 8.04838 8.78227 8.04838C8.07255 8.04838 7.41332 7.72937 6.09412 7.09063Z"                  stroke={orderStatus === "Delivered" ? "black" : "#B5B5B5"}
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div
              className={`mt-2 text-center w-32 text-[11px] font-normal leading-6 tracking-[-0.2px] ${orderStatus === "Delivered" ? "text-[#242424]" : "text-[#B5B5B5]"}`}
            >
              Out For Delivery
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
