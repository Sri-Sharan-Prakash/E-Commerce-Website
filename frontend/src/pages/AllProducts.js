import React, { useEffect, useState } from 'react';
import { IoAddCircleOutline } from "react-icons/io5";
import { FaBoxOpen } from "react-icons/fa";
import { toast } from 'react-toastify';

import UploadProduct from '../components/UploadProduct';
import SummaryApi from '../common';
import AdminProductCard from '../components/AdminProductCard';

// Skeleton Component for a clean loading state
const ProductGridSkeleton = () => {
    const skeletons = Array.from({ length: 8 }); // Display 8 skeleton cards
    return (
        <div className='grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6'>
            {skeletons.map((_, index) => (
                <div key={`skeleton-${index}`} className='bg-white rounded-lg shadow-md animate-pulse'>
                    <div className='bg-slate-200 h-48 rounded-t-lg'></div>
                    <div className='p-4 space-y-3'>
                        <div className='h-6 bg-slate-200 rounded'></div>
                        <div className='flex justify-between items-center'>
                            <div className='h-6 w-1/3 bg-slate-200 rounded'></div>
                            <div className='h-10 w-10 bg-slate-200 rounded-full'></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Empty State Component for when no products are found
const EmptyState = ({ onUploadClick }) => (
    <div className='flex flex-col items-center justify-center text-center h-full text-slate-500'>
        <FaBoxOpen size={60} className="mb-4" />
        <h3 className='text-xl font-semibold text-slate-700'>No Products Found</h3>
        <p className='mt-1 mb-4'>Get started by uploading your first product.</p>
        <button
            className='flex items-center gap-2 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-2 px-4 rounded-full font-semibold'
            onClick={onUploadClick}
        >
            <IoAddCircleOutline size={22} />
            Upload Your First Product
        </button>
    </div>
);


const AllProducts = () => {
    const [openUploadProduct, setOpenUploadProduct] = useState(false);
    const [allProduct, setAllProduct] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllProduct = async () => {
        setLoading(true);
        try {
            const response = await fetch(SummaryApi.allProduct.url);
            const dataResponse = await response.json();
            if (dataResponse.success) {
                setAllProduct(dataResponse.data || []);
            } else {
                toast.error(dataResponse.message);
            }
        } catch (error) {
            toast.error("An error occurred while fetching products.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllProduct();
    }, []);

    return (
        <div className='h-[calc(100vh-120px)] flex flex-col'>
            {/* --- Page Header --- */}
            <header className='bg-white py-3 px-6 flex justify-between items-center shadow-sm flex-shrink-0'>
                <div className='flex items-center gap-4'>
                    <h2 className='text-xl font-bold text-slate-800'>All Products</h2>
                    {!loading && (
                        <span className='bg-slate-200 text-slate-600 text-sm font-semibold px-3 py-1 rounded-full'>
                            {allProduct.length} {allProduct.length === 1 ? 'Product' : 'Products'}
                        </span>
                    )}
                </div>
                <button
                    className='flex items-center gap-2 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1.5 px-4 rounded-full font-semibold'
                    onClick={() => setOpenUploadProduct(true)}
                >
                    <IoAddCircleOutline size={20} />
                    <span>Upload Product</span>
                </button>
            </header>

            {/* --- Main Content Area (Scrollable) --- */}
            <main className='p-6 flex-grow overflow-y-auto'>
                {loading ? (
                    <ProductGridSkeleton />
                ) : allProduct.length > 0 ? (
                    <div className='grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6'>
                        {allProduct.map((product) => (
                            <AdminProductCard
                                data={product}
                                key={product._id}
                                fetchdata={fetchAllProduct}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState onUploadClick={() => setOpenUploadProduct(true)} />
                )}
            </main>

            {/* --- Upload Product Modal --- */}
            {openUploadProduct && (
                <UploadProduct
                    onClose={() => setOpenUploadProduct(false)}
                    fetchData={fetchAllProduct}
                />
            )}
        </div>
    );
}

export default AllProducts;