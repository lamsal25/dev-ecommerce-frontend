import Image from "next/image";
import React from "react";

export default function ShoppingBanner() {
  return (
    <section className="relative container m-auto bg-primary mt-30 rounded shadow-lg">
      <div className="  mx-auto grid grid-cols-1 md:grid-cols-2 items-center px-6 relative z-10">
        {/* Left - Girl Image */}
         
        <div className="relative w-[450px] h-[320px] -mt-28 -ml-20 md:ml-0 ">
          <Image
            src="/shopping-girl.png" 
            alt="Shopping Girl"
            layout="fill"
            objectFit="fit"
            priority
          />
        </div>

        {/* Right - Text */}
        <div className="text-center md:text-left text-white  justify-center">
          <h2 className=" text-center text-4xl md:text-5xl font-bold mb-3 text-secondary">IT’S SHOPPING TIME</h2>
          <p className="text-lg text-center md:text-xl font-medium">SHOPPING NOW MADE MORE EASIER!</p>
        </div>
      </div>
    </section>
  );
}
