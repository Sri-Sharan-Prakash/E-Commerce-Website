import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSpinner, FaEnvelope, FaCheckCircle } from "react-icons/fa";
import SummaryApi from '../common'; // Assuming you have this for your API endpoints

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false); // To show success state

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(SummaryApi.forgotPassword.url, { // Ensure you have this endpoint in SummaryApi
                method: SummaryApi.forgotPassword.method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                setIsSubmitted(true); // Switch to success view
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("An unexpected error occurred. Please try again.");
            console.error("Forgot Password Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='min-h-[calc(100vh-120px)] flex items-center justify-center bg-slate-100 p-4'>
            <div className='bg-white w-full max-w-md rounded-lg shadow-lg p-8 animate-fade-in-up'>
                {isSubmitted ? (
                    // --- Success State ---
                    <div className='text-center flex flex-col items-center'>
                        <FaCheckCircle className='text-green-500 text-6xl mb-4' />
                        <h2 className='text-2xl font-bold text-slate-800 mb-2'>Check Your Email</h2>
                        <p className='text-slate-600'>
                            We've sent a password reset link to <span className='font-semibold'>{email}</span>. Please follow the instructions in the email to reset your password.
                        </p>
                        <Link to='/login' className='text-red-600 hover:underline mt-6 font-semibold'>
                            &larr; Back to Login
                        </Link>
                    </div>
                ) : (
                    // --- Initial Form State ---
                    <>
                        <div className='text-center mb-6'>
                            <h2 className='text-2xl font-bold text-slate-800'>Forgot Your Password?</h2>
                            <p className='text-slate-500 mt-2'>No problem. Enter your email address below and we'll send you a link to reset it.</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className='space-y-6'>
                            <div>
                                <label htmlFor='email' className='block text-sm font-medium text-slate-700'>
                                    Email Address
                                </label>
                                <div className='relative mt-1'>
                                    <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                                        <FaEnvelope className='h-5 w-5 text-slate-400' />
                                    </span>
                                    <input
                                        type='email'
                                        id='email'
                                        name='email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder='you@example.com'
                                        className='w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
                                        required
                                    />
                                </div>
                            </div>
                            
                            <button
                                type='submit'
                                className='w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400 disabled:cursor-not-allowed'
                                disabled={loading}
                            >
                                {loading ? (
                                    <FaSpinner className='animate-spin' />
                                ) : (
                                    'Send Reset Link'
                                )}
                            </button>
                        </form>
                        
                        <div className='text-center mt-6'>
                            <Link to='/login' className='text-sm text-red-600 hover:underline font-medium'>
                                Remember your password? Login
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

export default ForgotPassword;