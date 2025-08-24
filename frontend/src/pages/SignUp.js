import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaSpinner, FaCamera } from "react-icons/fa";

import imageTobase64 from '../helpers/imageTobase64';
import SummaryApi from '../common';

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [data, setData] = useState({
        email: "",
        password: "",
        name: "",
        confirmPassword: "",
        profilePic: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUploadPic = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const imagePic = await imageTobase64(file);
            setData((prev) => ({ ...prev, profilePic: imagePic }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (data.password !== data.confirmPassword) {
            toast.error("Passwords do not match. Please check and try again.");
            return;
        }
        
        setLoading(true);
        try {
            const dataResponse = await fetch(SummaryApi.signUP.url, {
                method: SummaryApi.signUP.method,
                headers: { "content-type": "application/json" },
                body: JSON.stringify(data)
            });
            const dataApi = await dataResponse.json();

            if (dataApi.success) {
                toast.success(dataApi.message);
                navigate("/login");
            } else {
                toast.error(dataApi.message);
            }
        } catch (error) {
            toast.error("An unexpected error occurred. Please try again.");
            console.error("Signup Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='min-h-[calc(100vh-120px)] flex items-center justify-center bg-slate-100 p-4'>
            <div className='bg-white w-full max-w-md rounded-2xl shadow-lg p-8 animate-fade-in-up'>
                <div className='text-center mb-6'>
                    <h2 className='text-3xl font-bold text-slate-800'>Create an Account</h2>
                    <p className='text-slate-500 mt-2'>Join us and start shopping!</p>
                </div>

                <form onSubmit={handleSubmit} className='space-y-5'>
                    {/* Profile Picture Upload */}
                    <div className='flex justify-center'>
                        <label htmlFor='profilePic' className='relative w-24 h-24 rounded-full group cursor-pointer'>
                            {data.profilePic?
                            <img 
                                src={data.profilePic} 
                                alt='Profile' 
                                className='w-full h-full object-cover rounded-full border-2 border-slate-200'
                            />:<FaUser size={85}/>}
                            <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full flex items-center justify-center transition-opacity'>
                                <FaCamera className='text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity' />
                            </div>
                            <input type='file' id='profilePic' className='hidden' onChange={handleUploadPic} accept="image/*" />
                        </label>
                    </div>

                    {/* Form Inputs */}
                    <div>
                        <label className='block text-sm font-medium text-slate-700'>Full Name</label>
                        <div className='relative mt-1'>
                            <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                                <FaUser className='h-5 w-5 text-slate-400' />
                            </span>
                            <input 
                                type='text' 
                                name='name' 
                                value={data.name} 
                                onChange={handleOnChange} 
                                placeholder='Your Name' 
                                className='w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500' 
                                required 
                            />
                        </div>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-slate-700'>Email Address</label>
                        <div className='relative mt-1'>
                            <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                                <FaEnvelope className='h-5 w-5 text-slate-400' />
                            </span>
                            <input 
                                type='email' 
                                name='email' 
                                value={data.email} 
                                onChange={handleOnChange} 
                                placeholder='you@example.com' 
                                className='w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500' 
                                required 
                            />
                        </div>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-slate-700'>Password</label>
                        <div className='relative mt-1'>
                            <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                                <FaLock className='h-5 w-5 text-slate-400' />
                            </span>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name='password' 
                                value={data.password} 
                                onChange={handleOnChange} 
                                placeholder='Your Password' 
                                className='w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500' 
                                required 
                            />
                            <button 
                                type='button' 
                                className='absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500' 
                                onClick={() => setShowPassword(p => !p)}
                            >
                                {showPassword ? <FaEyeSlash size={20}/> : <FaEye size={20}/>}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-slate-700'>Confirm Password</label>
                        <div className='relative mt-1'>
                            <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                                <FaLock className='h-5 w-5 text-slate-400' />
                            </span>
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                name='confirmPassword' 
                                value={data.confirmPassword} 
                                onChange={handleOnChange} 
                                placeholder='Confirm Your Password' 
                                className='w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500' 
                                required 
                            />
                            <button 
                                type='button' 
                                className='absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500' 
                                onClick={() => setShowConfirmPassword(p => !p)}
                            >
                                {showConfirmPassword ? <FaEyeSlash size={20}/> : <FaEye size={20}/>}
                            </button>
                        </div>
                    </div>

                    <button
                        type='submit'
                        className='w-full flex justify-center py-3 px-4 mt-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400 disabled:cursor-not-allowed'
                        disabled={loading}
                    >
                        {loading ? <FaSpinner className='animate-spin' size={20}/> : 'Sign Up'}
                    </button>
                </form>

                <p className='text-center text-sm text-slate-600 mt-8'>
                    Already have an account? <Link to={"/login"} className='font-medium text-red-600 hover:underline'>Login</Link>
                </p>
            </div>
        </section>
    )
}

export default SignUp;