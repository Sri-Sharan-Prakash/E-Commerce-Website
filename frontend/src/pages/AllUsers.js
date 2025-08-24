import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import moment from 'moment';
import { MdModeEdit } from "react-icons/md";
import { FaUsersSlash } from "react-icons/fa";

import SummaryApi from '../common';
import ChangeUserRole from '../components/ChangeUserRole';

// Helper component for visually distinct role badges
const UserRoleBadge = ({ role }) => {
    const roleClasses = {
        ADMIN: 'bg-red-100 text-red-700',
        GENERAL: 'bg-blue-100 text-blue-700',
    };
    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${roleClasses[role] || 'bg-slate-100 text-slate-700'}`}>
            {role}
        </span>
    );
};

// High-fidelity skeleton loader for a better user experience
const UserTableSkeleton = () => (
    <>
        {/* Desktop Skeleton */}
        <tbody className='hidden md:table-row-group'>
            {Array.from({ length: 5 }).map((_, index) => (
                <tr key={`skeleton-desktop-${index}`} className='border-b border-slate-200 animate-pulse'>
                    <td className='py-4 px-4'><div className='h-4 w-4 bg-slate-200 rounded'></div></td>
                    <td className='py-4 px-4'>
                        <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 bg-slate-200 rounded-full'></div>
                            <div className='w-32 h-4 bg-slate-200 rounded'></div>
                        </div>
                    </td>
                    <td className='py-4 px-4'><div className='h-4 w-40 bg-slate-200 rounded'></div></td>
                    <td className='py-4 px-4'><div className='h-6 w-16 bg-slate-200 rounded-full'></div></td>
                    <td className='py-4 px-4'><div className='h-4 w-24 bg-slate-200 rounded'></div></td>
                    <td className='py-4 px-4'><div className='h-8 w-8 bg-slate-200 rounded-full'></div></td>
                </tr>
            ))}
        </tbody>
        {/* Mobile Skeleton */}
        <div className='grid grid-cols-1 gap-4 md:hidden animate-pulse'>
             {Array.from({ length: 5 }).map((_, index) => (
                <div key={`skeleton-mobile-${index}`} className='bg-white p-4 rounded-lg shadow-sm border border-slate-200 space-y-4'>
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 bg-slate-200 rounded-full'></div>
                            <div className='space-y-2'>
                                <div className='h-4 w-24 bg-slate-200 rounded'></div>
                                <div className='h-3 w-32 bg-slate-200 rounded'></div>
                            </div>
                        </div>
                        <div className='h-8 w-8 bg-slate-200 rounded-full'></div>
                    </div>
                    <div className='flex justify-between'>
                        <div className='h-6 w-16 bg-slate-200 rounded-full'></div>
                        <div className='h-4 w-24 bg-slate-200 rounded'></div>
                    </div>
                </div>
             ))}
        </div>
    </>
);

const AllUsers = () => {
    const [allUser, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openUpdateRole, setOpenUpdateRole] = useState(false);
    const [updateUserDetails, setUpdateUserDetails] = useState(null);

    const fetchAllUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(SummaryApi.allUser.url, {
                method: SummaryApi.allUser.method,
                credentials: 'include',
            });
            const dataResponse = await response.json();
            if (dataResponse.success) {
                setAllUsers(dataResponse.data);
            } else {
                toast.error(dataResponse.message);
            }
        } catch (error) {
            toast.error("An error occurred while fetching users.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllUsers();
    }, [fetchAllUsers]);

    const handleEditClick = (user) => {
        setUpdateUserDetails(user);
        setOpenUpdateRole(true);
    };

    const getInitials = (name) => {
        if (!name) return '?';
        const names = name.split(' ');
        return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase() : name[0].toUpperCase();
    };

    return (
        <div className='bg-white p-4 md:p-6 rounded-lg shadow-md'>
            {/* --- Header --- */}
            <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-bold text-slate-800'>All Users</h2>
                {!loading && (
                    <span className='bg-slate-200 text-slate-600 text-sm font-semibold px-3 py-1 rounded-full'>
                        {allUser.length} {allUser.length === 1 ? 'User' : 'Users'}
                    </span>
                )}
            </div>

            <div className='overflow-x-auto'>
                {/* --- Desktop Table --- */}
                <table className='w-full min-w-[600px] hidden md:table'>
                    <thead className='bg-slate-50 text-left text-sm text-slate-600'>
                        <tr>
                            <th className='py-3 px-4 font-semibold'>#</th>
                            <th className='py-3 px-4 font-semibold'>User</th>
                            <th className='py-3 px-4 font-semibold'>Email</th>
                            <th className='py-3 px-4 font-semibold'>Role</th>
                            <th className='py-3 px-4 font-semibold'>Created Date</th>
                            <th className='py-3 px-4 font-semibold text-center'>Action</th>
                        </tr>
                    </thead>
                    {!loading && (
                        <tbody className='text-slate-700'>
                            {allUser.map((user, index) => (
                                <tr key={user._id} className='border-b border-slate-200 hover:bg-slate-50 transition-colors'>
                                    <td className='py-3 px-4'>{index + 1}</td>
                                    <td className='py-3 px-4'>
                                        <div className='flex items-center gap-3'>
                                            <div className='w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-semibold text-slate-500'>
                                                {getInitials(user.name)}
                                            </div>
                                            <span>{user.name}</span>
                                        </div>
                                    </td>
                                    <td className='py-3 px-4'>{user.email}</td>
                                    <td className='py-3 px-4'><UserRoleBadge role={user.role} /></td>
                                    <td className='py-3 px-4'>{moment(user.createdAt).format('LL')}</td>
                                    <td className='py-3 px-4 text-center'>
                                        <button className='p-2 rounded-full hover:bg-green-100 text-green-600 transition-colors' onClick={() => handleEditClick(user)}>
                                            <MdModeEdit size={18}/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>
                
                {loading && <UserTableSkeleton />}

                {/* --- Mobile Card View --- */}
                {!loading && (
                    <div className='grid grid-cols-1 gap-4 md:hidden'>
                        {allUser.map((user, index) => (
                            <div key={user._id} className='bg-white p-4 rounded-lg shadow-sm border border-slate-200'>
                                <div className='flex justify-between items-start'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-semibold text-slate-500'>
                                            {getInitials(user.name)}
                                        </div>
                                        <div>
                                            <p className='font-semibold text-slate-800'>{user.name}</p>
                                            <p className='text-sm text-slate-500'>{user.email}</p>
                                        </div>
                                    </div>
                                    <button className='p-2 rounded-full hover:bg-green-100 text-green-600' onClick={() => handleEditClick(user)}>
                                        <MdModeEdit size={18}/>
                                    </button>
                                </div>
                                <div className='flex justify-between items-center mt-4 pt-4 border-t border-slate-100'>
                                    <UserRoleBadge role={user.role} />
                                    <p className='text-sm text-slate-500'>{moment(user.createdAt).format('LL')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {/* --- Empty State --- */}
                {!loading && allUser.length === 0 && (
                     <div className='flex flex-col items-center justify-center text-center py-16 text-slate-500'>
                        <FaUsersSlash size={50} className="mb-4" />
                        <h3 className='text-xl font-semibold text-slate-700'>No Users Found</h3>
                        <p className='mt-1'>There are currently no users in the system.</p>
                    </div>
                )}
            </div>

            {/* --- Update Role Modal --- */}
            {openUpdateRole && updateUserDetails && (
                <ChangeUserRole
                    onClose={() => setOpenUpdateRole(false)}
                    name={updateUserDetails.name}
                    email={updateUserDetails.email}
                    role={updateUserDetails.role}
                    userId={updateUserDetails._id}
                    callFunc={fetchAllUsers}
                />
            )}
        </div>
    );
};

export default AllUsers;