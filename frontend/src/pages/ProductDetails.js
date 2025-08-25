import React, { useCallback, useContext, useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaCreditCard, FaPlus, FaMinus } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { FiChevronDown } from "react-icons/fi";
import { toast } from 'react-toastify';

import SummaryApi from '../common';
import displayINRCurrency from '../helpers/displayCurrency';
import addToCart from '../helpers/addToCart';
import Context from '../context';
import CategroyWiseProductDisplay from '../components/CategoryWiseProductDisplay';

// --- Reusable Sub-components (No changes needed) ---
const Breadcrumbs = ({ category, productName }) => (
    <nav className="text-sm text-slate-500 mb-4 flex items-center gap-2 flex-wrap">
        <Link to="/" className="hover:text-red-500">Home</Link>
        <span className='select-none'>/</span>
        <Link to={`/product-category?category=${category}`} className="hover:text-red-500 capitalize">{category}</Link>
        <span className='select-none'>/</span>
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

const AccordionItem = ({ title, children, isOpen, onClick }) => (
    <div className="border-b">
        <button onClick={onClick} className="w-full flex justify-between items-center py-4 text-left font-semibold text-slate-800">
            <span>{title}</span>
            <FiChevronDown className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
            <div className="pb-4 text-slate-600 leading-relaxed">{children}</div>
        </div>
    </div>
);

const ProductDetailsSkeleton = () => (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 animate-pulse'>
        <div className='flex flex-col-reverse md:flex-row gap-4'><div className='flex md:flex-col gap-2'>{Array.from({ length: 4 }).map((_, i) => <div key={i} className='w-20 h-20 bg-slate-200 rounded-md flex-shrink-0'></div>)}</div><div className='w-full h-80 md:h-auto bg-slate-200 rounded-lg'></div></div>
        <div className='flex flex-col gap-4'><div className='h-6 w-1/4 bg-slate-200 rounded-full'></div><div className='h-10 w-full bg-slate-200 rounded-lg'></div><div className='h-6 w-1/3 bg-slate-200 rounded-full'></div><div className='flex gap-8 items-center'><div className='h-8 w-1/2 bg-slate-200 rounded-lg'></div><div className='h-8 w-1/4 bg-slate-200 rounded-lg'></div></div><div className='flex gap-4 my-2'><div className='h-12 w-36 bg-slate-200 rounded-lg'></div><div className='h-12 w-36 bg-slate-200 rounded-lg'></div></div><div className='space-y-3 mt-4'><div className='h-4 w-full bg-slate-200 rounded'></div><div className='h-4 w-full bg-slate-200 rounded'></div><div className='h-4 w-3/4 bg-slate-200 rounded'></div></div></div>
    </div>
);


const ProductDetails = () => {
    const [data, setData] = useState(null);
    const { id: productId } = useParams();
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState("");
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [activeAccordion, setActiveAccordion] = useState('description');
    
    const [quantity, setQuantity] = useState(0);
    const [cartItemId, setCartItemId] = useState(null);

    const { fetchUserAddToCart } = useContext(Context);
    const navigate = useNavigate();

    // This logic for fetching data is correct.
    const fetchProductCartQuantity = useCallback(async () => {
        const endpoint = SummaryApi.addToCartProductView;
        try {
            const response = await fetch(endpoint.url, {
                method: endpoint.method,
                credentials: 'include',
            });
            const responseData = await response.json();
            if (responseData.success) {
                const itemInCart = responseData.data?.find(item => item.productId?._id === productId);
                if (itemInCart) {
                    setQuantity(itemInCart.quantity);
                    setCartItemId(itemInCart._id);
                } else {
                    setQuantity(0);
                    setCartItemId(null);
                }
            }
        } catch (err) {
            toast.error("Could not verify cart status.");
        }
    }, [productId]);

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
                setActiveImage(dataResponse.data.productImage[0] || "");
            } else {
                // If the product isn't found, setData to null to show the not found message
                setData(null); 
                toast.error(dataResponse.message);
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchProductDetails();
        fetchProductCartQuantity();
    }, [productId, fetchProductDetails, fetchProductCartQuantity]);

    // This logic remains correct.
    const updateCartQuantity = async (id, newQuantity) => {
        try {
            const response = await fetch(SummaryApi.updateCartProduct.url, {
                method: SummaryApi.updateCartProduct.method,
                credentials: 'include',
                headers: { "content-type": 'application/json' },
                body: JSON.stringify({ _id: id, quantity: newQuantity })
            });
            const responseData = await response.json();
            if (responseData.success) {
                await fetchProductCartQuantity();
                await fetchUserAddToCart();
            } else {
                toast.error(responseData.message);
            }
        } catch (err) {
            toast.error("Failed to update quantity.");
        }
    };

    const increaseQty = () => {
        const newQty = quantity + 1;
        if (data && newQty > data.quantity) {
            toast.error("Maximum available stock reached");
            return;
        }
        if (cartItemId) {
            updateCartQuantity(cartItemId, newQty);
        }
    };

    const decreaseQty = () => {
        const newQty = quantity - 1;
        if (newQty >= 1 && cartItemId) {
            updateCartQuantity(cartItemId, newQty);
        }
    };

    const handleAddToCart = async (id) => {
        const response = await addToCart(id, 1);
        if (response.success) {
            await fetchProductCartQuantity();
            await fetchUserAddToCart();
        }
    };

    const handleBuyProduct = async (id) => {
        await addToCart(id, quantity > 0 ? quantity : 1);
        await fetchUserAddToCart();
        navigate("/cart");
    };

    // --- FIX APPLIED HERE ---

    // 1. First, handle the loading state
    if (loading) {
        return <div className='container mx-auto p-4 md:p-8'><ProductDetailsSkeleton /></div>;
    }

    // 2. Second, handle the case where the data could not be fetched
    if (!data) {
        return <div className="container mx-auto p-8 text-center text-xl text-slate-500">Product not found.</div>;
    }

    // 3. Only if loading is false AND data exists, proceed to render the component.
    // It is now safe to calculate variables that depend on 'data'.
    const discount = data.price > 0 ? Math.round(((data.price - data.sellingPrice) / data.price) * 100) : 0;
    const isOutOfStock = data.quantity <= 0;

    return (
        <main className='container mx-auto p-4 md:p-8'>
            {lightboxOpen && <Lightbox imageUrl={activeImage} onClose={() => setLightboxOpen(false)} />}

            <Breadcrumbs category={data.category} productName={data.productName} />

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'>
                {/* Image Gallery */}
                <div className='flex flex-col-reverse md:flex-row gap-4'>
                    <div className='flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto scrollbar-none'>
                        {data.productImage.map((imgURL, index) => (
                            <div key={imgURL + index} className={`w-20 h-20 bg-slate-100 rounded-md flex-shrink-0 p-1 cursor-pointer ${activeImage === imgURL ? 'border-2 border-red-500' : 'border-2 border-transparent'}`} onMouseEnter={() => setActiveImage(imgURL)}>
                                <img src={imgURL} className='w-full h-full object-contain' alt="thumbnail" />
                            </div>
                        ))}
                    </div>
                    <div className='w-full h-80 md:h-auto bg-slate-100 rounded-lg flex justify-center items-center relative'>
                        <img src={activeImage} className='h-full max-h-[450px] w-full object-contain mix-blend-multiply cursor-pointer' alt={data.productName} onClick={() => setLightboxOpen(true)} />
                        {isOutOfStock && <div className="absolute top-4 left-4 bg-slate-700 text-white text-sm font-semibold px-3 py-1.5 rounded-full">Out of Stock</div>}
                    </div>
                </div>

                {/* Product Details */}
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

                    {/* Action Buttons */}
                    {isOutOfStock ? (
                        <div className="my-4 p-4 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 text-center font-semibold">This product is currently unavailable.</div>
                    ) : (
                        quantity === 0 ? (
                            <div className='flex flex-col sm:flex-row items-center gap-3 my-4'>
                                <button className='w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-red-600 rounded-lg px-6 py-3 font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors' onClick={() => handleAddToCart(data._id)}>
                                    <FaShoppingCart /> Add To Cart
                                </button>
                                <button className='w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-red-600 rounded-lg px-6 py-3 font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors' onClick={() => handleBuyProduct(data._id)}>
                                    <FaCreditCard /> Buy Now
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className='flex items-center gap-4 my-3'>
                                    <div className='font-semibold text-slate-700'>Quantity:</div>
                                    <div className='flex items-center border rounded-lg'>
                                        <button className='w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-l-lg disabled:text-slate-300 disabled:cursor-not-allowed' onClick={decreaseQty} disabled={quantity <= 1}><FaMinus /></button>
                                        <span className='w-10 h-10 flex items-center justify-center font-semibold'>{quantity}</span>
                                        <button className='w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-r-lg disabled:text-slate-300 disabled:cursor-not-allowed' onClick={increaseQty} disabled={quantity >= data.quantity}><FaPlus /></button>
                                    </div>
                                </div>
                                <div className='flex flex-col sm:flex-row items-center gap-3 my-4'>
                                    <button className='w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-slate-700 rounded-lg px-6 py-3 font-semibold text-slate-700 hover:bg-slate-700 hover:text-white transition-colors' onClick={() => navigate("/cart")}>
                                        <FaShoppingCart /> Go to Cart
                                    </button>
                                     <button className='w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-red-600 rounded-lg px-6 py-3 font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors' onClick={() => handleBuyProduct(data._id)}>
                                        <FaCreditCard /> Buy Now
                                    </button>
                                </div>
                            </>
                        )
                    )}

                    {/* Accordion for Description */}
                    <div className='mt-4'>
                        <AccordionItem title="Product Description" isOpen={activeAccordion === 'description'} onClick={() => setActiveAccordion(activeAccordion === 'description' ? null : 'description')}>
                            {data.description}
                        </AccordionItem>
                        <AccordionItem title="Specifications" isOpen={activeAccordion === 'specs'} onClick={() => setActiveAccordion(activeAccordion === 'specs' ? null : 'specs')}>
                           Content for specifications goes here.
                        </AccordionItem>
                    </div>
                </div>
            </div>

            {/* Recommended Products */}
            {data.category && (
                <div className='mt-12 lg:mt-20'>
                    <CategroyWiseProductDisplay category={data.category} heading={"Recommended Products"} />
                </div>
            )}
        </main>
    );
}

export default ProductDetails;