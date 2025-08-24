import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcStripe } from 'react-icons/fa';

// Reusable component for footer columns to keep the code DRY
const FooterColumn = ({ title, links }) => (
  <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/6 mb-8 md:mb-0">
    <h3 className="font-bold text-gray-800 mb-4">{title}</h3>
    <ul>
      {links.map((link, index) => (
        <li key={index} className="mb-2">
          <a href={link.url} className="text-gray-600 hover:text-black transition-colors duration-300">
            {link.name}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  const shopLinks = [
    { name: 'New Arrivals', url: '#' },
    { name: 'Best Sellers', url: '#' },
    { name: 'Sale', url: '#' },
    { name: 'All Products', url: '#' },
  ];

  const serviceLinks = [
    { name: 'FAQ', url: '#' },
    { name: 'Contact Us', url: '#' },
    { name: 'Shipping', url: '#' },
    { name: 'Returns', url: '#' },
  ];

  const aboutLinks = [
    { name: 'Our Story', url: '#' },
    { name: 'Careers', url: '#' },
    { name: 'Press', url: '#' },
  ];

  return (
    <footer className='bg-slate-100 border-t border-slate-200'>
      <div className='container mx-auto p-8 md:p-12'>
        <div className='flex flex-wrap justify-between gap-8'>

          {/* Link Columns */}
          <FooterColumn title="Shop" links={shopLinks} />
          <FooterColumn title="Customer Service" links={serviceLinks} />
          <FooterColumn title="About Us" links={aboutLinks} />

          {/* Newsletter and Social Section */}
          <div className="w-full md:w-auto lg:w-1/4">
            <h3 className="font-bold text-gray-800 mb-4">Join Our Newsletter</h3>
            <p className="text-gray-600 mb-4">Get updates on new products and special offers.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 border border-r-0 rounded-l-md focus:outline-none"
              />
              <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded-r-md hover:bg-gray-800 transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
            <div className='mt-6'>
                <h3 className="font-bold text-gray-800 mb-4">Follow Us</h3>
                <div className='flex space-x-4'>
                    <a href="#" aria-label="Facebook" className='text-gray-600 hover:text-black transition-colors duration-300'><FaFacebook size={24}/></a>
                    <a href="#" aria-label="Twitter" className='text-gray-600 hover:text-black transition-colors duration-300'><FaTwitter size={24}/></a>
                    <a href="#" aria-label="Instagram" className='text-gray-600 hover:text-black transition-colors duration-300'><FaInstagram size={24}/></a>
                    <a href="#" aria-label="LinkedIn" className='text-gray-600 hover:text-black transition-colors duration-300'><FaLinkedin size={24}/></a>
                </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center'>
            <p className='text-gray-500 text-sm mb-4 md:mb-0'>
                © {new Date().getFullYear()} Your E-commerce Site. All Rights Reserved.
            </p>
            <div className='flex items-center space-x-4'>
                <p className='text-gray-600 font-semibold'>Accepted Payments:</p>
                <div className='flex space-x-2 text-2xl text-gray-700'>
                    <FaCcVisa />
                    <FaCcMastercard />
                    <FaCcPaypal />
                    <FaCcStripe />
                </div>
            </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;