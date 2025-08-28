import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import SummaryApi from '../common';
import Context from '../context';
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
import displayINRCurrency from '../helpers/displayCurrency';
import addToCart from '../helpers/addToCart';
import scrollTop from '../helpers/scrollTop';

/**
 * A reusable, enhanced product card component.
 */
const ProductCard = ({ product, onAddToCart }) => {
    const discount = Math.round(((product.price - product.sellingPrice) / product.price) * 100);

    return (
        <Link to={`/product/${product?._id}`} className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden' onClick={scrollTop}>
            <div className='bg-slate-100 h-48 p-4 flex justify-center items-center rounded-t-lg'>
                <img src={product.productImage[0]} alt={product.productName} className='object-contain h-full w-full mix-blend-multiply transition-transform duration-300 group-hover:scale-105'/>
                {/* Discount Badge */}
                {discount > 0 && (
                    <div className='absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full'>
                        {discount}% OFF
                    </div>
                )}
            </div>
            <div className='p-4 flex flex-col gap-2'>
                <h2 className='font-semibold text-slate-800 text-lg text-ellipsis line-clamp-1' title={product.productName}>{product.productName}</h2>
                <p className='capitalize text-slate-500 -mt-1'>{product.category}</p>
                <div className='flex items-center gap-2'>
                    <p className='text-red-600 font-bold text-lg'>{displayINRCurrency(product.sellingPrice)}</p>
                    <p className='text-slate-500 line-through text-sm'>{displayINRCurrency(product.price)}</p>
                </div>
                {/* Add to Cart Button - appears on hover */}
                <button 
                    className='w-full text-white bg-red-600 hover:bg-red-700 py-2 rounded-lg font-semibold transition-all duration-300 transform translate-y-96 group-hover:translate-y-0' 
                    onClick={(e) => onAddToCart(e, product._id)}
                >
                    Add to Cart
                </button>
            </div>
        </Link>
    );
};

/**
 * A high-fidelity skeleton loader for the product card.
 */
const ProductCardSkeleton = () => (
    <div className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded-lg shadow-md animate-pulse'>
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

const CategroyWiseProductDisplay = ({ category, heading }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef(null);
    const { fetchUserAddToCart } = useContext(Context);

    const handleAddToCart = async (e, id) => {
        e.preventDefault(); // Prevent navigation when clicking the button
        e.stopPropagation(); // Stop event bubbling
        await addToCart(e, id);
        fetchUserAddToCart();
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        const categoryProduct = await fetchCategoryWiseProduct(category);
        setData(categoryProduct?.data || []);
        setLoading(false);
    }, [category]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    return (
        <section className='container mx-auto px-4 my-8 relative' aria-labelledby={`category-heading-${category}`}>
            <div className='flex items-center justify-between mb-4'>
                <h2 id={`category-heading-${category}`} className='text-2xl md:text-3xl font-semibold text-slate-800'>{heading}</h2>
                <Link to={`/product-category?category=${category}`} className='text-red-600 font-semibold hover:underline'>
                    See All
                </Link>
            </div>

            <div className='relative'>
                {/* Carousel Content */}
                <div ref={scrollContainerRef} className='flex items-stretch gap-4 md:gap-6 overflow-x-scroll scrollbar-none py-4'>
                    {loading
                        ? Array.from({ length: 10 }).map((_, index) => <ProductCardSkeleton key={`skeleton-${index}`} />)
                        : data.map((product) => <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />)
                    }
                </div>

                {/* Desktop Navigation Buttons */}
                {!loading && data.length > 3 && (
                     <>
                        <button onClick={scrollLeft} className='absolute top-1/2 -left-2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full hidden md:flex items-center justify-center text-slate-800 hover:bg-slate-100 transition-colors'>
                            <FaAngleLeft />
                        </button>
                        <button onClick={scrollRight} className='absolute top-1/2 -right-2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full hidden md:flex items-center justify-center text-slate-800 hover:bg-slate-100 transition-colors'>
                            <FaAngleRight />
                        </button>
                     </>
                )}
            </div>
        </section>
    );
};

export default CategroyWiseProductDisplay;