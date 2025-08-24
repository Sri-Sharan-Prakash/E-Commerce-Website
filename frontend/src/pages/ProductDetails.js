import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaCreditCard, FaPlus, FaMinus } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { toast } from 'react-toastify';

import SummaryApi from '../common';
import displayINRCurrency from '../helpers/displayCurrency';
import addToCart from '../helpers/addToCart';
import Context from '../context';
import CategroyWiseProductDisplay from '../components/CategoryWiseProductDisplay';

// --- Reusable Sub-components for a Clean Structure ---

const Breadcrumbs = ({ category, productName }) => (
    <nav className="text-sm text-slate-500 mb-4 flex items-center gap-2">
        <Link to="/" className="hover:text-red-500">Home</Link>
        <span>/</span>
        <Link to={`/product-category?category=${category}`} className="hover:text-red-500 capitalize">{category}</Link>
        <span>/</span>
        <span className="font-semibold text-slate-700 truncate">{productName}</span>
    </nav>
);

const Lightbox = ({ imageUrl, onClose }) => {
    useEffect(() => {
        const handleKeyDown = (e) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center animate-fade-in" onClick={onClose}>
            <button className="absolute top-4 right-4 text-white text-3xl p-2 z-50" onClick={onClose}><IoMdClose /></button>
            <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <img src={imageUrl} alt="Full screen product view" className="object-contain w-full h-full animate-zoom-in" />
            </div>
        </div>
    );
};

const ProductDetailsSkeleton = () => (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 animate-pulse'>
        <div className='flex flex-col-reverse md:flex-row gap-4'>
            <div className='flex md:flex-col gap-2'>{Array.from({ length: 4 }).map((_, i) => <div key={i} className='w-20 h-20 bg-slate-200 rounded-md flex-shrink-0'></div>)}</div>
            <div className='w-full h-80 md:h-auto bg-slate-200 rounded-lg'></div>
        </div>
        <div className='flex flex-col gap-4'>
            <div className='h-6 w-1/4 bg-slate-200 rounded-full'></div>
            <div className='h-10 w-full bg-slate-200 rounded-lg'></div>
            <div className='h-6 w-1/3 bg-slate-200 rounded-full'></div>
            <div className='flex gap-8 items-center'><div className='h-8 w-1/2 bg-slate-200 rounded-lg'></div><div className='h-8 w-1/4 bg-slate-200 rounded-lg'></div></div>
            <div className='flex gap-4 my-2'><div className='h-12 w-36 bg-slate-200 rounded-lg'></div><div className='h-12 w-36 bg-slate-200 rounded-lg'></div></div>
            <div className='space-y-3 mt-4'><div className='h-4 w-full bg-slate-200 rounded'></div><div className='h-4 w-full bg-slate-200 rounded'></div><div className='h-4 w-3/4 bg-slate-200 rounded'></div></div>
        </div>
    </div>
);


const ProductDetails = () => {
    const [data, setData] = useState(null);
    const { id: productId } = useParams();
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [lightboxOpen, setLightboxOpen] = useState(false);
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
                setData(null); // Set data to null if product not found
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchProductDetails();
    }, [fetchProductDetails]);

    const handleAddToCart = async (id) => {
        await addToCart({ preventDefault: () => {} }, id, quantity);
        fetchUserAddToCart();
    };

    const handleBuyProduct = async (id) => {
        await addToCart({ preventDefault: () => {} }, id, quantity);
        fetchUserAddToCart();
        navigate("/cart");
    };

    if (loading) {
        return <div className='container mx-auto p-4 md:p-8'><ProductDetailsSkeleton /></div>;
    }

    if (!data) {
        return <div className="container mx-auto p-8 text-center text-xl text-slate-500">Product not found.</div>;
    }
    
    const discount = data.price > 0 ? Math.round(((data.price - data.sellingPrice) / data.price) * 100) : 0;

    return (
        <main className='container mx-auto p-4 md:p-8'>
            {lightboxOpen && <Lightbox imageUrl={activeImage} onClose={() => setLightboxOpen(false)} />}
            
            <Breadcrumbs category={data.category} productName={data.productName} />

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'>
                {/* --- Image Gallery --- */}
                <div className='flex flex-col-reverse md:flex-row gap-4'>
                    <div className='flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto scrollbar-none'>
                        {data.productImage.map((imgURL) => (
                            <div key={imgURL} className={`w-20 h-20 bg-slate-100 rounded-md flex-shrink-0 p-1 cursor-pointer ${activeImage === imgURL ? 'border-2 border-red-500' : 'border-2 border-transparent'}`} onMouseEnter={() => setActiveImage(imgURL)}>
                                <img src={imgURL} className='w-full h-full object-contain' alt="thumbnail" />
                            </div>
                        ))}
                    </div>
                    <div className='w-full h-80 md:h-auto bg-slate-100 rounded-lg flex justify-center items-center cursor-pointer' onClick={() => setLightboxOpen(true)}>
                        <img src={activeImage} className='h-full max-h-[450px] w-full object-contain mix-blend-multiply' alt={data.productName} />
                    </div>
                </div>

                {/* --- Product Details --- */}
                <div className='flex flex-col'>
                    <span className='bg-red-100 text-red-600 px-3 py-1 text-sm rounded-full inline-block w-fit font-semibold'>{data.brandName}</span>
                    <h1 className='text-3xl lg:text-4xl font-bold text-slate-800 mt-2'>{data.productName}</h1>
                    <div className='flex items-center gap-4 mt-2'>
                        <div className='flex items-center gap-1 text-yellow-400'><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></div>
                        <a href="#reviews" className='text-sm text-slate-500 hover:underline'>(125 reviews)</a>
                    </div>

                    <div className='flex items-baseline gap-3 my-4'>
                        <p className='text-3xl font-bold text-red-600'>{displayINRCurrency(data.sellingPrice)}</p>
                        <p className='text-xl text-slate-400 line-through'>{displayINRCurrency(data.price)}</p>
                        {discount > 0 && <span className='text-lg font-semibold text-green-600'>({discount}% OFF)</span>}
                    </div>

                    <div className='flex items-center gap-4 my-3'>
                        <div className='font-semibold text-slate-700'>Quantity:</div>
                        <div className='flex items-center border rounded-lg'>
                            <button className='w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-l-lg' onClick={() => setQuantity(q => Math.max(1, q - 1))}><FaMinus /></button>
                            <span className='w-10 h-10 flex items-center justify-center font-semibold'>{quantity}</span>
                            <button className='w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-r-lg' onClick={() => setQuantity(q => q + 1)}><FaPlus /></button>
                        </div>
                    </div>

                    <div className='flex flex-col sm:flex-row items-center gap-3 my-4'>
                        <button className='w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-red-600 rounded-lg px-6 py-3 font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors' onClick={() => handleAddToCart(data._id)}>
                            <FaShoppingCart /> Add To Cart
                        </button>
                        <button className='w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-slate-700 rounded-lg px-6 py-3 font-semibold text-slate-700 hover:bg-slate-700 hover:text-white transition-colors' onClick={() => handleBuyProduct(data._id)}>
                            <FaCreditCard /> Buy Now
                        </button>
                    </div>

                    <div className='border-t pt-4 mt-4'>
                        <h3 className='text-lg font-semibold text-slate-700 mb-2'>Description</h3>
                        <p className='text-slate-600 leading-relaxed'>{data.description}</p>
                    </div>
                </div>
            </div>

            {data.category && (
                <div className='mt-12 lg:mt-20'>
                    <CategroyWiseProductDisplay category={data.category} heading={"Recommended Products"} />
                </div>
            )}
        </main>
    );
}

export default ProductDetails;