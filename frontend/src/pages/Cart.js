import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdDelete } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";

import SummaryApi from '../common';
import Context from '../context';
import displayINRCurrency from '../helpers/displayCurrency';

// --- Local Components for a Clean & Organized Structure ---

const CartItemSkeleton = () => (
    <div className='w-full bg-white rounded-lg shadow-sm p-4 flex gap-4 border border-slate-200 animate-pulse'>
        <div className='w-28 h-28 bg-slate-200 rounded'></div>
        <div className='flex-1 space-y-3'>
            <div className='h-6 w-3/4 bg-slate-200 rounded'></div>
            <div className='h-4 w-1/2 bg-slate-200 rounded'></div>
            <div className='h-8 w-24 bg-slate-200 rounded'></div>
        </div>
    </div>
);

const SummarySkeleton = () => (
    <div className='bg-white rounded-lg shadow-sm p-6 border border-slate-200 animate-pulse'>
        <div className='h-6 w-1/3 bg-slate-200 rounded mb-6'></div>
        <div className='space-y-3'>
            <div className='flex justify-between'><div className='h-5 w-1/4 bg-slate-200 rounded'></div><div className='h-5 w-1/4 bg-slate-200 rounded'></div></div>
            <div className='flex justify-between'><div className='h-5 w-1/3 bg-slate-200 rounded'></div><div className='h-5 w-1/4 bg-slate-200 rounded'></div></div>
        </div>
        <div className='h-12 w-full bg-slate-200 rounded mt-6'></div>
    </div>
);

const EmptyCart = () => (
    <div className='flex flex-col items-center justify-center text-center py-16 px-4 bg-white rounded-lg shadow-sm'>
        <FaShoppingCart size={60} className="text-slate-300 mb-4" />
        <h2 className='text-2xl font-semibold text-slate-800'>Your cart is empty</h2>
        <p className='text-slate-500 mt-2 mb-6'>Looks like you haven't added anything to your cart yet.</p>
        <Link 
            to="/" 
            className='bg-red-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-red-700 transition-colors'
        >
            Continue Shopping
        </Link>
    </div>
);


const Cart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { fetchUserAddToCart } = useContext(Context);

    const fetchData = useCallback(async () => {
        try {
            const response = await fetch(SummaryApi.addToCartProductView.url, {
                method: SummaryApi.addToCartProductView.method,
                credentials: 'include',
            });
            const responseData = await response.json();
            if (responseData.success) {
                setData(responseData.data);
            } else {
                toast.error(responseData.message);
            }
        } catch (error) {
            toast.error("An error occurred while fetching your cart.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        fetchData();
    }, [fetchData]);

    const validCartItems = useMemo(() => {
        return data.filter(item => item.productId !== null);
    }, [data]);

    const updateCartQuantity = async (id, quantity) => {
        try {
            const response = await fetch(SummaryApi.updateCartProduct.url, {
                method: SummaryApi.updateCartProduct.method,
                credentials: 'include',
                headers: { "content-type": 'application/json' },
                body: JSON.stringify({ _id: id, quantity: quantity }),
            });
            const responseData = await response.json();
            if (responseData.success) {
                fetchData();
            } else {
                toast.error(responseData.message);
            }
        } catch (error) {
            toast.error("Failed to update cart.");
        }
    };

    const increaseQty = (id, qty) => updateCartQuantity(id, qty + 1);
    const decreaseQty = (id, qty) => {
        if (qty > 1) {
            updateCartQuantity(id, qty - 1)
        }
    };

    const deleteCartProduct = async (id) => {
        try {
            const response = await fetch(SummaryApi.deleteCartProduct.url, {
                method: SummaryApi.deleteCartProduct.method,
                credentials: 'include',
                headers: { "content-type": 'application/json' },
                body: JSON.stringify({ _id: id }),
            });
            const responseData = await response.json();
            if (responseData.success) {
                fetchData();
                fetchUserAddToCart();
                toast.success("Item removed from cart");
            } else {
                toast.error(responseData.message);
            }
        } catch (error) {
            toast.error("Failed to remove item.");
        }
    };

    const { totalQty, totalPrice } = useMemo(() => {
        const totalQty = validCartItems.reduce((acc, item) => acc + item.quantity, 0);
        const totalPrice = validCartItems.reduce((acc, item) => acc + (item.quantity * item.productId.sellingPrice), 0);
        return { totalQty, totalPrice };
    }, [validCartItems]);

    return (
        <div className='container mx-auto p-4 md:p-6 min-h-[calc(100vh-128px)]'>
            <h1 className='text-2xl md:text-3xl font-bold text-slate-800 mb-6'>Your Shopping Cart</h1>
            
            {loading ? (
                <div className='flex flex-col lg:flex-row gap-8'>
                    <div className='flex-1 space-y-4'>{Array.from({ length: 3 }).map((_, i) => <CartItemSkeleton key={i} />)}</div>
                    <div className='w-full lg:w-80'><SummarySkeleton /></div>
                </div>
            ) : validCartItems.length === 0 ? (
                <EmptyCart />
            ) : (
                <div className='flex flex-col lg:flex-row gap-8 items-start'>
                    <div className='flex-1 w-full space-y-4'>
                        {validCartItems.map((product) => (
                            <div key={product._id} className='w-full bg-white rounded-lg shadow-sm p-4 flex gap-4 border border-slate-200'>
                                <div className='w-28 h-28 bg-slate-100 rounded flex-shrink-0'>
                                    <img src={product.productId.productImage[0]} className='w-full h-full object-contain mix-blend-multiply' alt={product.productId.productName} />
                                </div>
                                <div className='flex-1 flex flex-col'>
                                    <div className='flex justify-between items-start'>
                                        <div>
                                            <h2 className='text-lg font-semibold text-slate-800 text-ellipsis line-clamp-1'>{product.productId.productName}</h2>
                                            <p className='capitalize text-sm text-slate-500'>{product.productId.category}</p>
                                        </div>
                                        <button className='text-slate-500 hover:text-red-600 p-1 rounded-full group' onClick={() => deleteCartProduct(product._id)}>
                                            <MdDelete size={22}/>
                                        </button>
                                    </div>
                                    <div className='flex items-center justify-between mt-auto'>
                                        <p className='text-red-600 font-bold text-lg'>{displayINRCurrency(product.productId.sellingPrice)}</p>
                                        <div className='flex items-center gap-3'>
                                            <button className='border border-slate-300 w-8 h-8 flex justify-center items-center rounded-md font-semibold hover:bg-slate-100' onClick={() => decreaseQty(product._id, product.quantity)}>-</button>
                                            <span className='font-semibold'>{product.quantity}</span>
                                            <button className='border border-slate-300 w-8 h-8 flex justify-center items-center rounded-md font-semibold hover:bg-slate-100' onClick={() => increaseQty(product._id, product.quantity)}>+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className='w-full lg:w-80 lg:sticky top-20'>
                        <div className='bg-white rounded-lg shadow-sm p-6 border border-slate-200'>
                            <h2 className='text-lg font-semibold text-slate-800 mb-4 pb-4 border-b'>Order Summary</h2>
                            <div className='space-y-2 text-slate-600'>
                                <div className='flex items-center justify-between'>
                                    <p>Total Items</p>
                                    <p className='font-semibold'>{totalQty}</p>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <p>Subtotal</p>
                                    <p className='font-semibold'>{displayINRCurrency(totalPrice)}</p>
                                </div>
                            </div>
                            <div className='flex items-center justify-between font-bold text-slate-800 mt-4 pt-4 border-t'>
                                <p>Total</p>
                                <p>{displayINRCurrency(totalPrice)}</p>
                            </div>
                            <button className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg mt-6 transition-colors'>
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;