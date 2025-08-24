import React, { useState, useCallback } from 'react';
import { IoMdClose } from "react-icons/io";
import { FaSpinner } from "react-icons/fa"; // For loading icon
import { HiOutlineUserCircle } from "react-icons/hi"; // For user avatar
import { FiChevronDown } from "react-icons/fi"; // For custom select arrow
import { toast } from 'react-toastify';

import ROLE from '../common/role';
import SummaryApi from '../common';

// For better readability and maintenance, define options outside the component
const ROLE_OPTIONS = Object.values(ROLE);

const ChangeUserRole = ({
    name,
    email,
    role,
    userId,
    onClose,
    callFunc,
}) => {
    const [userRole, setUserRole] = useState(role);
    const [isUpdating, setIsUpdating] = useState(false);

    const getInitials = (name) => {
        if (!name) return '?';
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name[0].toUpperCase();
    };

    const updateUserRole = useCallback(async () => {
        if (isUpdating) return; // Prevent multiple clicks
        setIsUpdating(true);
        try {
            const response = await fetch(SummaryApi.updateUser.url, {
                method: SummaryApi.updateUser.method,
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, role: userRole }),
            });

            const responseData = await response.json();

            if (responseData.success) {
                toast.success(responseData.message);
                callFunc(); // Refresh the data in the parent component
                onClose(); // Close the modal
            } else {
                toast.error(responseData.message);
            }
        } catch (error) {
            toast.error("An unexpected error occurred. Please try again.");
            console.error("Role update failed:", error);
        } finally {
            setIsUpdating(false);
        }
    }, [userId, userRole, isUpdating, callFunc, onClose]);

    return (
        <div 
            className='fixed top-0 bottom-0 left-0 right-0 w-full h-full z-20 flex justify-center items-center bg-black bg-opacity-60' 
            aria-labelledby="change-role-title" 
            role="dialog" 
            aria-modal="true"
        >
            <div className='bg-white rounded-lg shadow-2xl w-full max-w-md animate-fade-in-up'>
                {/* --- Modal Header --- */}
                <div className='flex justify-between items-center px-6 py-4 border-b border-slate-200'>
                    <h2 id="change-role-title" className='text-xl font-bold text-slate-800'>
                        Update User Role
                    </h2>
                    <button onClick={onClose} className='p-2 rounded-full hover:bg-slate-100 transition-colors' aria-label="Close modal">
                        <IoMdClose size={22} className='text-slate-600' />
                    </button>
                </div>

                {/* --- Modal Body --- */}
                <div className='p-6 space-y-6'>
                    <div className='flex items-center gap-4'>
                        <div className='w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-2xl font-semibold text-slate-600'>
                            {getInitials(name)}
                        </div>
                        <div>
                            <p className='font-semibold text-lg text-slate-900'>{name}</p>
                            <p className='text-sm text-slate-500'>{email}</p>
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <label htmlFor="userRole" className='font-medium text-slate-700'>Assign New Role:</label>
                        <div className='relative'>
                            <select 
                                id="userRole"
                                value={userRole} 
                                onChange={(e) => setUserRole(e.target.value)}
                                className='w-full appearance-none border border-slate-300 rounded-md px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-shadow'
                            >
                                {ROLE_OPTIONS.map(el => (
                                    <option value={el} key={el}>{el}</option>
                                ))}
                            </select>
                            <FiChevronDown className='absolute top-1/2 right-4 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none' />
                        </div>
                    </div>
                </div>

                {/* --- Modal Footer --- */}
                <div className='flex justify-end items-center gap-4 px-6 py-4 bg-slate-50 rounded-b-lg'>
                    <button 
                        onClick={onClose} 
                        className='px-4 py-2 rounded-md text-slate-700 font-semibold hover:bg-slate-200 transition-colors'
                    >
                        Cancel
                    </button>
                    <button 
                        className='w-36 px-4 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors flex items-center justify-center disabled:bg-red-400 disabled:cursor-not-allowed' 
                        onClick={updateUserRole}
                        disabled={isUpdating || role === userRole}
                    >
                        {isUpdating ? <FaSpinner className="animate-spin" /> : 'Update Role'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangeUserRole;