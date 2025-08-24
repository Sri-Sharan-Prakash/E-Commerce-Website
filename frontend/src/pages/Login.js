import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc"; // Google icon
import { toast } from 'react-toastify';

import SummaryApi from '../common';
import Context from '../context';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [data, setData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { fetchUserDetails, fetchUserAddToCart } = useContext(Context);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataResponse = await fetch(SummaryApi.signIn.url, {
                method: SummaryApi.signIn.method,
                credentials: 'include',
                headers: { "content-type": "application/json" },
                body: JSON.stringify(data)
            });
            const dataApi = await dataResponse.json();

            if (dataApi.success) {
                toast.success(dataApi.message);
                navigate('/');
                fetchUserDetails();
                fetchUserAddToCart();
            } else {
                toast.error(dataApi.message);
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
            console.error("Login error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='min-h-[calc(100vh-120px)] flex items-center justify-center bg-slate-100 p-4'>
            <div className='bg-white w-full max-w-md rounded-2xl shadow-lg p-8 animate-fade-in-up'>
                <div className='text-center mb-8'>
                    <h2 className='text-3xl font-bold text-slate-800'>Welcome Back!</h2>
                    <p className='text-slate-500 mt-2'>Sign in to continue to your account.</p>
                </div>

                <form onSubmit={handleSubmit} className='space-y-6'>
                    {/* Email Input */}
                    <div>
                        <label htmlFor='email' className='block text-sm font-medium text-slate-700'>Email Address</label>
                        <div className='relative mt-1'>
                            <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                                <FaEnvelope className='h-5 w-5 text-slate-400' />
                            </span>
                            <input
                                type='email'
                                id='email'
                                name='email'
                                value={data.email}
                                onChange={handleOnChange}
                                placeholder='you@example.com'
                                className='w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition'
                                required
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor='password'  className='block text-sm font-medium text-slate-700'>Password</label>
                        <div className='relative mt-1'>
                             <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                                <FaLock className='h-5 w-5 text-slate-400' />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                id='password'
                                value={data.password}
                                name='password'
                                onChange={handleOnChange}
                                placeholder='Your Password'
                                className='w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition'
                                required
                            />
                            <button type='button' className='absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700' onClick={() => setShowPassword(prev => !prev)}>
                                {showPassword ? <FaEyeSlash size={20}/> : <FaEye size={20}/>}
                            </button>
                        </div>
                        <div className='text-right mt-2'>
                            <Link to={'/forgot-password'} className='text-sm text-red-600 hover:underline'>
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type='submit'
                        className='w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors'
                        disabled={loading}
                    >
                        {loading ? <FaSpinner className='animate-spin' size={20}/> : 'Login'}
                    </button>
                </form>

                {/* Social Login Divider */}
                <div className='my-6 flex items-center'>
                    <div className='flex-grow border-t border-slate-300'></div>
                    <span className='flex-shrink mx-4 text-slate-400 text-sm'>Or continue with</span>
                    <div className='flex-grow border-t border-slate-300'></div>
                </div>

                {/* Social Login Button */}
                <button
                    type='button'
                    className='w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors'
                    // onClick={handleGoogleLogin} // Add your Google login handler here
                >
                    <FcGoogle size={22} />
                    <span>Continue with Google</span>
                </button>

                <p className='text-center text-sm text-slate-600 mt-8'>
                    Don't have an account? <Link to={"/sign-up"} className='font-medium text-red-600 hover:underline'>Sign up</Link>
                </p>
            </div>
        </section>
    );
}

export default Login;