import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-primary container m-auto text-white py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 leading-10">
        {/* Exclusive */}
        {/* <div>
          <h3 className="text-lg font-semibold mb-2">Exclusive</h3>
          <p className="mb-2">Subscribe</p>
          <p className="mb-4">Get 10% off your first order</p>
          <div className="items-center bg-primary rounded-md inline-flex border border-white">
            <input
              type="email"
              placeholder="Enter your email"
              className=" px-4 text-white outline-none rounded-l-md w-40 text-1xl"
            />
            <Button className="px-4 py-2 text-white rounded-r-md text-2xl">
              ➤
            </Button>
          </div>
        </div> */}

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Support</h3>
          <p>New Baneshwor,</p>
          <p>Kathmandu, Nepal</p>
          <a href=""><p className="mt-2">ecommerce@gmail.com</p></a>
          <a href=""><p>+977-9841984198</p></a>
        </div>

        {/* Account */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Account</h3>
          <ul className="space-y-1">
            <li><a href="/dashboard" className="hover:underline">My Account</a></li>
            <li><a href="/privacyPolicy" className="hover:underline">Privacy Policy</a></li>
            <li><a href="/login" className="hover:underline">Login </a></li>
            <li><a href="/register" className="hover:underline">Register </a></li>
          </ul>
        </div>

        {/* Quick Link */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1">
            {/* <li><a href="/terms-of-use" className="hover:underline">Terms Of Use</a></li> */}
            <li><a href="/cart" className="hover:underline">Cart</a></li>
            <li><a href="/wishlist" className="hover:underline">Wishlist</a></li>
            <li><a href="/faq" className="hover:underline">FAQ</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
            <li><a href="/viewAllProducts" className="hover:underline">Shop</a></li>

          </ul>
        </div>


      </div>

      <div className="text-center text-sm text-white/50 mt-10">
        © Copyright Techy Lads 2025. All rights reserved
      </div>
    </footer>
  );
};

export default Footer;