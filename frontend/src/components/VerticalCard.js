import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import scrollTop from '../helpers/scrollTop';
import displayINRCurrency from '../helpers/displayCurrency';
import addToCart from '../helpers/addToCart';
import Context from '../context';

/**
 * A reusable, high-fidelity skeleton loader that mimics the final product card.
 */
const ProductCardSkeleton = () => (
    <div className='w-full bg-white rounded-lg shadow-md animate-pulse'>
        <div className='bg-slate-200 h-48 rounded-t-lg'></div>
        <div className='p-4 grid gap-3'>
            <div className='h-6 bg-slate-200 rounded-md'></div>
            <div className='h-4 w-1/2 bg-slate-200 rounded-md'></div>
            <div className='flex gap-3'>
                <div className='h-6 w-full bg-slate-200 rounded-md'></div>
                <div className='h-6 w-full bg-slate-200 rounded-md'></div>
            </div>
            <div className='h-10 w-full bg-slate-200 rounded-lg mt-1'></div>
        </div>
    </div>
);

/**
 * The redesigned, interactive vertical product card component.
 */
const ProductCard = ({ product, onAddToCart }) => {
    // Calculate discount percentage to display in a badge
    const discount = Math.round(((product.price - product.sellingPrice) / product.price) * 100);

    return (
        <Link 
            to={"/product/" + product?._id} 
            className='w-full bg-white rounded-lg shadow-md transition-all duration-300 group hover:shadow-xl hover:-translate-y-1 flex flex-col' 
            onClick={scrollTop}
        >
            <div className='bg-slate-100 h-48 p-4 flex justify-center items-center rounded-t-lg relative overflow-hidden'>
                <img 
                    src={product?.productImage[0]} 
                    alt={product?.productName}
                    className='object-contain h-full w-full mix-blend-multiply transition-transform duration-300 group-hover:scale-105'
                />
                {/* Discount Badge */}
                {discount > 0 && (
                    <div className='absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full z-10'>
                        {discount}% OFF
                    </div>
                )}
            </div>
            <div className='p-4 flex flex-col gap-2 flex-grow'>
                {/* min-h ensures all cards have same height regardless of title length */}
                <h2 className='font-semibold text-slate-800 text-lg text-ellipsis line-clamp-2 min-h-[3.5rem]' title={product?.productName}>
                    {product?.productName}
                </h2>
                <p className='capitalize text-slate-500 -mt-1'>{product?.category}</p>
                <div className='flex items-center gap-2 mt-auto'>
                    <p className='text-red-600 font-bold text-lg'>{ displayINRCurrency(product?.sellingPrice) }</p>
                    <p className='text-slate-500 line-through text-sm'>{ displayINRCurrency(product?.price) }</p>
                </div>
                <button 
                    className='w-full text-white bg-red-600 hover:bg-red-700 py-2 rounded-lg font-semibold transition-colors mt-2' 
                    onClick={(e) => onAddToCart(e, product?._id)}
                >
                    Add to Cart
                </button>
            </div>
        </Link>
    );
};

// --- Main Component ---

const VerticalCard = ({ loading, data = [] }) => {
    const { fetchUserAddToCart } = useContext(Context);

    const handleAddToCart = async (e, id) => {
        e.preventDefault(); // Prevent Link navigation when clicking button
        e.stopPropagation();
        await addToCart(e, id);
        fetchUserAddToCart();
    };

    return (
        <div className='grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] justify-center gap-6'>
            {loading 
                ? (
                    // Display skeleton loaders when loading
                    Array.from({ length: 12 }).map((_, index) => (
                        <ProductCardSkeleton key={`skeleton-${index}`} />
                    ))
                ) 
                : (
                    // Display actual product cards when data is available
                    data.map((product) => (
                        <ProductCard 
                            key={product?._id} 
                            product={product} 
                            onAddToCart={handleAddToCart} 
                        />
                    ))
                )
            }
        </div>
    );
}

export default VerticalCard;