import Image from "next/image";

export default function HeroSection() {
  return (

    <section className="container m-auto bg-primary text-white py-6 px-8  " style={{
      background: "radial-gradient(circle at 60% center, var(--color-primary) 5%, var(--color-primary) 100%) ",

    }}>
      <div className="max-w-7xl container m-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left Content */}
        <div className="md:w-1/2">
          <h1 className="text-5xl md:text-4xl font-serif font-semibold mb-4">
            Your <span className="bg-secondary">One-Stop Shop</span>
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold mb-8">
            Get the best quality <br /> products at the <br /> best price
          </h2>
          <p className="text-lg text-gray-200 mb-8">
            We have prepared special discounts for you
          </p>
          <button className="bg-secondary hover:bg-orange-600 hover:cursor-pointer text-white font-semibold px-6 py-3 rounded">
            Buy Now!
          </button>
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 flex justify-center">
          <Image
            src={'/headphone.png'}
            alt="Headphones"
            width={400}
            height={400}
            className="w-[300px] md:w-[350px] object-contain"
          />
        </div>
      </div>
    </section>
  );
}
