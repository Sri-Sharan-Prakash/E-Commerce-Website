import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaCreditCard } from "react-icons/fa";
import { toast } from 'react-toastify'; // Added toast for error feedback

import SummaryApi from '../common';
import displayINRCurrency from '../helpers/displayCurrency';
import addToCart from '../helpers/addToCart';
import Context from '../context';

// *** THE FIX IS HERE ***
// The path has been corrected from './CategoryWiseProductDisplay' to '../components/CategoryWiseProductDisplay'
import CategroyWiseProductDisplay from '../components/CategoryWiseProductDisplay';

// --- Skeleton Loader Component ---
const ProductDetailsSkeleton = () => (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 animate-pulse'>
        {/* Image Gallery Skeleton */}
        <div className='flex flex-col-reverse lg:flex-row gap-4'>
            <div className='flex lg:flex-col gap-2'>{Array.from({ length: 4 }).map((_, i) => <div key={i} className='w-20 h-20 bg-slate-200 rounded-md flex-shrink-0'></div>)}</div>
            <div className='w-full h-80 lg:h-auto bg-slate-200 rounded-lg'></div>
        </div>
        {/* Product Details Skeleton */}
        <div className='flex flex-col gap-4'>
            <div className='h-6 w-1/4 bg-slate-200 rounded-full'></div>
            <div className='h-10 w-full bg-slate-200 rounded-lg'></div>
            <div className='h-6 w-1/3 bg-slate-200 rounded-full'></div>
            <div className='flex gap-8 items-center'>
                <div className='h-8 w-1/2 bg-slate-200 rounded-lg'></div>
                <div className='h-8 w-1/4 bg-slate-200 rounded-lg'></div>
            </div>
            <div className='flex gap-4 my-2'>
                <div className='h-12 w-32 bg-slate-200 rounded-lg'></div>
                <div className='h-12 w-32 bg-slate-200 rounded-lg'></div>
            </div>
            <div className='space-y-3 mt-4'>
                <div className='h-4 w-full bg-slate-200 rounded'></div>
                <div className='h-4 w-full bg-slate-200 rounded'></div>
                <div className='h-4 w-3/4 bg-slate-200 rounded'></div>
            </div>
        </div>
    </div>
);


const ProductDetails = () => {
    const [data, setData] = useState({
        productName: "",
        brandName: "",
        category: "",
        productImage: [],
        description: "",
        price: 0,
        sellingPrice: 0
    });
    const { id: productId } = useParams();
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState("");
    const [zoomImageCoordinate, setZoomImageCoordinate] = useState({ x: 0, y: 0 });
    const [showZoom, setShowZoom] = useState(false);
    const { fetchUserAddToCart } = useContext(Context);
    const navigate = useNavigate();

    const fetchProductDetails = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(SummaryApi.productDetails.url, {
                method: SummaryApi.productDetails.method,
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ productId }),
            });
            const dataResponse = await response.json();
            if (dataResponse.success) {
                setData(dataResponse.data);
                setActiveImage(dataResponse.data.productImage[0]);
            } else {
                toast.error(dataResponse.message);
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
            console.error("Failed to fetch product details", error);
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchProductDetails();
    }, [fetchProductDetails]);

    const handleZoomImage = useCallback((e) => {
        setShowZoom(true);
        const { left, top, width, height } = e.target.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        setZoomImageCoordinate({ x, y });
    }, []);

    const handleAddToCart = async (e, id) => {
        await addToCart(e, id);
        fetchUserAddToCart();
    };

    const handleBuyProduct = async (e, id) => {
        await addToCart(e, id);
        fetchUserAddToCart();
        navigate("/cart");
    };

    const discount = data.price > 0 ? Math.round(((data.price - data.sellingPrice) / data.price) * 100) : 0;

    if (loading) {
        return <div className='container mx-auto p-4 md:p-8'><ProductDetailsSkeleton /></div>;
    }

    return (
        <main className='container mx-auto p-4 md:p-8'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'>
                {/* --- Image Gallery --- */}
                <div className='flex flex-col-reverse lg:flex-row gap-4 h-full'>
                    {/* Thumbnails */}
                    <div className='flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto scrollbar-none'>
                        {data.productImage.map((imgURL, index) => (
                            <div
                                key={imgURL + index}
                                className={`w-20 h-20 bg-slate-100 rounded-md flex-shrink-0 p-1 cursor-pointer ${activeImage === imgURL ? 'border-2 border-red-500' : 'border-2 border-transparent'}`}
                                onMouseEnter={() => setActiveImage(imgURL)}
                            >
                                <img src={imgURL} className='w-full h-full object-contain' alt="product thumbnail" />
                            </div>
                        ))}
                    </div>
                    {/* Main Image */}
                    <div className='w-full h-80 lg:h-auto bg-slate-100 rounded-lg flex justify-center items-center relative overflow-hidden'>
                        <img src={activeImage} className='h-full max-h-[450px] w-full object-contain mix-blend-multiply' alt="product" onMouseMove={handleZoomImage} onMouseLeave={() => setShowZoom(false)} />
                        {/* Desktop Image Zoom */}
                        {showZoom && (
                            <div className='hidden lg:block absolute min-w-[500px] min-h-[500px] bg-white -right-[510px] top-0 overflow-hidden border shadow-lg rounded-md'>
                                <div
                                    className='w-full h-full scale-150'
                                    style={{
                                        backgroundImage: `url(${activeImage})`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}%`
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* --- Product Details --- */}
                <div className='flex flex-col gap-3'>
                    <span className='bg-red-100 text-red-600 px-3 py-1 text-sm rounded-full inline-block w-fit font-semibold'>{data.brandName}</span>
                    <h2 className='text-3xl lg:text-4xl font-bold text-slate-800'>{data.productName}</h2>
                    <p className='capitalize text-slate-500'>{data.category}</p>
                    <div className='flex items-center gap-2 text-yellow-400'>
                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                        <span className='text-sm text-slate-500'>(5.0)</span>
                    </div>

                    <div className='flex items-baseline gap-3 my-2'>
                        <p className='text-3xl font-bold text-red-600'>{displayINRCurrency(data.sellingPrice)}</p>
                        <p className='text-xl text-slate-400 line-through'>{displayINRCurrency(data.price)}</p>
                        {discount > 0 && <span className='text-lg font-semibold text-green-600'>({discount}% OFF)</span>}
                    </div>

                    <div className='flex flex-col sm:flex-row items-center gap-3 my-3'>
                        <button className='w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-red-600 rounded-lg px-6 py-2.5 font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors' onClick={(e) => handleAddToCart(e, data._id)}>
                            <FaShoppingCart /> Add To Cart
                        </button>
                         <button className='w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-slate-700 rounded-lg px-6 py-2.5 font-semibold text-slate-700 hover:bg-slate-700 hover:text-white transition-colors' onClick={(e) => handleBuyProduct(e, data._id)}>
                            <FaCreditCard /> Buy Now
                        </button>
                    </div>

                    <div>
                        <h3 className='text-lg font-semibold text-slate-700 my-2'>Description</h3>
                        <p className='text-slate-600 leading-relaxed'>{data.description}</p>
                    </div>
                </div>
            </div>

            {data.category && (
                <div className='mt-12 lg:mt-16'>
                    <CategroyWiseProductDisplay category={data.category} heading={"Recommended Products"} />
                </div>
            )}
        </main>
    );
}

export default ProductDetails;