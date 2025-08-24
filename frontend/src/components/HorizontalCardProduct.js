import React, { useState, useRef, useContext, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';

// --- Import all missing helpers and hooks ---
import displayINRCurrency from '../helpers/displayCurrency';
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
import addToCart from '../helpers/addToCart';
import Context from '../context';

// --- Local Components for Cleanliness ---

/**
 * A reusable, high-fidelity skeleton loader for the horizontal product card.
 */
const ProductCardSkeleton = () => (
    <div className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 bg-white rounded-lg shadow-md flex animate-pulse'>
        <div className='bg-slate-200 h-full p-4 min-w-[120px] md:min-w-[145px] rounded-l-lg'></div>
        <div className='p-4 grid w-full gap-2'>
            <div className='h-5 bg-slate-200 rounded-full'></div>
            <div className='h-4 w-1/2 bg-slate-200 rounded-full'></div>
            <div className='flex gap-3 w-full'>
                <div className='h-5 w-full bg-slate-200 rounded-full'></div>
                <div className='h-5 w-full bg-slate-200 rounded-full'></div>
            </div>
            <div className='h-8 w-full bg-slate-200 rounded-full mt-1'></div>
        </div>
    </div>
);

/**
 * The redesigned, interactive product card component.
 */
const ProductCard = ({ product, onAddToCart }) => {
    const discount = Math.round(((product.price - product.sellingPrice) / product.price) * 100);

    return (
        <Link 
            to={"product/"+product?._id} 
            className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 bg-white rounded-lg shadow-md flex transition-all duration-300 group hover:shadow-xl hover:-translate-y-1'
        >
            <div className='bg-slate-100 h-full p-3 min-w-[120px] md:min-w-[145px] flex justify-center items-center rounded-l-lg relative overflow-hidden'>
                <img 
                    src={product.productImage[0]} 
                    alt={product.productName}
                    className='object-contain h-full transition-transform duration-300 group-hover:scale-105'
                />
                {discount > 0 && (
                    <div className='absolute top-1 left-1 bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full'>
                        {discount}% OFF
                    </div>
                )}
            </div>
            <div className='p-3 grid w-full relative overflow-hidden'>
                <div>
                    <h2 className='font-semibold text-base md:text-lg text-ellipsis line-clamp-1 text-slate-800' title={product.productName}>
                        {product.productName}
                    </h2>
                    <p className='capitalize text-sm text-slate-500'>{product.category}</p>
                </div>
                <div className='flex gap-2 items-baseline mt-1'>
                    <p className='text-red-600 font-bold text-lg'>{ displayINRCurrency(product.sellingPrice) }</p>
                    <p className='text-slate-400 line-through text-sm'>{ displayINRCurrency(product.price)  }</p>
                </div>
                <button 
                    className='absolute bottom-3 right-3 text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-full transition-all duration-300 transform translate-y-[150%] group-hover:translate-y-0' 
                    onClick={(e) => onAddToCart(e, product._id)}
                >
                    Add to Cart
                </button>
            </div>
        </Link>
    );
};


// --- Main Component ---

const HorizontalCardProduct = ({ category, heading }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollElement = useRef(null);
    const { fetchUserAddToCart } = useContext(Context);

    const handleAddToCart = async (e, id) => {
        e.preventDefault(); // Prevent Link navigation
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
        if (scrollElement.current) {
            scrollElement.current.scrollLeft += 300;
        }
    };

    const scrollLeft = () => {
        if (scrollElement.current) {
            scrollElement.current.scrollLeft -= 300;
        }
    };

    return (
        <section className='container mx-auto px-4 my-8' aria-labelledby={`horizontal-heading-${category}`}>
            <div className='flex items-center justify-between mb-4'>
                <h2 id={`horizontal-heading-${category}`} className='text-2xl md:text-3xl font-semibold text-slate-800'>{heading}</h2>
                <Link to={`/product-category?category=${category}`} className='font-semibold text-red-600 hover:underline'>
                    See All
                </Link>
            </div>
            
            <div className='relative'>
                <div ref={scrollElement} className='flex items-stretch gap-4 md:gap-6 overflow-x-scroll scrollbar-none transition-all py-4'>
                    {loading 
                        ? (Array.from({ length: 10 }).map((_, index) => <ProductCardSkeleton key={`skeleton-${index}`} />))
                        : (data.map((product) => <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />))
                    }
                </div>

                {/* Desktop Navigation Buttons */}
                {!loading && data.length > 4 && (
                    <>
                        <button  className='bg-white shadow-lg rounded-full p-2 w-10 h-10 absolute left-0 top-1/2 -translate-y-1/2 text-lg hidden md:flex justify-center items-center hover:bg-slate-100 transition-colors' onClick={scrollLeft} aria-label="Scroll left">
                            <FaAngleLeft/>
                        </button>
                        <button  className='bg-white shadow-lg rounded-full p-2 w-10 h-10 absolute right-0 top-1/2 -translate-y-1/2 text-lg hidden md:flex justify-center items-center hover:bg-slate-100 transition-colors' onClick={scrollRight} aria-label="Scroll right">
                            <FaAngleRight/>
                        </button> 
                    </>
                )}
            </div>
        </section>
    );
}

export default HorizontalCardProduct;