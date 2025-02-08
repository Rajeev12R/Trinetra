import React from 'react';

const Footer = () => {
  return (
    <footer className="">
      <div className="mx-auto grid max-w-screen-xl gap-y-8 gap-x-16 px-4 py-10 sm:px-20 md:grid-cols-2 xl:grid-cols-3 xl:px-10">
        <div className="max-w-sm">
          <div className="mb-6 flex h-10 items-center space-x-2">
            <img className="h-full object-contain" src="/images/logo-circle.png" alt="" />
            <span className="text-lg font-medium text-teal-600">Serenity</span>
          </div>
          <div className="text-gray-500">Your mental health matters. Chat a being who recommends you a good health.</div>
        </div>
        <div className="">
          <div className="mt-4 mb-2 font-medium xl:mb-4">Guides</div>
          <nav aria-label="Guides Navigation" className="text-gray-500">
            <ul className="space-y-3">
              <li><a className="hover:text-teal-600 hover:underline" href="#">How to make a footer</a></li>
              <li><a className="hover:text-teal-600 hover:underline" href="#">Designing your app</a></li>
              <li><a className="hover:text-teal-600 hover:underline" href="#">Getting help from the community</a></li>
              <li><a className="hover:text-teal-600 hover:underline" href="#">Pricing vs Hourly Rate</a></li>
            </ul>
          </nav>
        </div>
        <div className="">
          <div className="mt-4 mb-2 font-medium xl:mb-4">Links</div>
          <nav aria-label="Footer Navigation" className="text-gray-500">
            <ul className="space-y-3">
              <li><a className="hover:text-teal-600 hover:underline" href="#">Pricing</a></li>
              <li><a className="hover:text-teal-600 hover:underline" href="#">Demo</a></li>
              <li><a className="hover:text-teal-600 hover:underline" href="#">Press</a></li>
              <li><a className="hover:text-teal-600 hover:underline" href="#">Support Hub</a></li>
              <li><a className="hover:text-teal-600 hover:underline" href="#">Contact</a></li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-screen-xl flex-col gap-y-4 px-4 py-3 text-center text-gray-500 sm:px-20 lg:flex-row lg:justify-between lg:text-left xl:px-10">
          <p className="">© 2025 Serenity | All Rights Reserved</p>
          <p className="-order-1 sm:order-none">Made by ❤️ Syntax Error</p>
          <p className="">
            <a className="" href="#">Privacy Policy</a>
            <span>|</span>
            <a className="" href="#">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;