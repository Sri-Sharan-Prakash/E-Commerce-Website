import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SummaryApi from '../common';

/**
 * A reusable skeleton component for the loading state.
 */
const CategoryLoadingSkeleton = () => (
    <div className='flex flex-col items-center gap-2'>
        <div className='w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-slate-200 animate-pulse'></div>
        <div className='h-4 w-16 bg-slate-200 rounded-md animate-pulse'></div>
    </div>
);

/**
 * The main component to display a list of product categories.
 */
const CategoryList = () => {
    const [categoryProduct, setCategoryProduct] = useState([]);
    const [loading, setLoading] = useState(false);

    // Using a fixed number for the skeleton array for consistency
    const loadingSkeletons = Array.from({ length: 10 });

    const fetchCategoryProduct = async () => {
        setLoading(true);
        try {
            const response = await fetch(SummaryApi.categoryProduct.url);
            const dataResponse = await response.json();
            setCategoryProduct(dataResponse.data);
        } catch (error) {
            console.error("Failed to fetch category products:", error);
            // Optionally, set an error state here to show a message to the user
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoryProduct();
    }, []);

    return (
        <section className='container mx-auto p-4' aria-labelledby="category-heading">
            {/* Section Header */}
            <div className='flex items-center justify-between mb-4'>
                 <h2 id="category-heading" className='text-2xl font-semibold text-slate-800'>Shop by Category</h2>
                 {/* Optional: Add a "View All" link here if you have a dedicated categories page */}
            </div>
            
            {/* Category Items Container */}
            <div className='relative'>
                 <div className='flex items-center gap-4 md:gap-8 overflow-x-scroll scrollbar-none py-4'>
                    {loading
                        ? (
                            loadingSkeletons.map((_, index) => (
                                <CategoryLoadingSkeleton key={`categoryLoading-${index}`} />
                            ))
                        )
                        : (
                            categoryProduct.map((product) => (
                                <Link
                                    to={`/product-category?category=${product?.category}`}
                                    className='flex-shrink-0 group'
                                    key={product?.category}
                                >
                                    <div className='w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden p-3 bg-slate-100 border border-slate-200 flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:shadow-md group-hover:-translate-y-1'>
                                        <img
                                            src={product?.productImage[0]}
                                            alt={product?.category}
                                            className='h-full w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-110'
                                        />
                                    </div>
                                    <p className='text-center text-sm md:text-base capitalize mt-2 font-medium text-slate-700 group-hover:text-red-600 transition-colors'>
                                        {product?.category}
                                    </p>
                                </Link>
                            ))
                        )
                    }
                 </div>
            </div>
        </section>
    );
}

export default CategoryList;