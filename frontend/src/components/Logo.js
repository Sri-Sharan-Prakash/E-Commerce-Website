import React from 'react';
import { FiShoppingBag } from 'react-icons/fi';

/**
 * Renders the official Amazon logo as a scalable SVG.
 * @param {object} props - The component props.
 * @param {number|string} props.w - The desired width of the logo.
 * @param {number|string} props.h - The desired height of the logo.
 */
const Logo = ({ w, h }) => {
  return (
    <div>
        <h1 className='text-2xl font-medium flex items-center gap-2'><FiShoppingBag color='red'/> Amazon</h1>
    </div>
  );
};

export default Logo;