import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaUserCircle, FaUsers, FaBox } from "react-icons/fa";
import { HiMenuAlt2 } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import ROLE from '../common/role';

// Navigation links configuration for easy maintenance
const adminNav = [
    { label: 'All Users', path: 'all-users', icon: <FaUsers size={18} /> },
    { label: 'All Products', path: 'all-products', icon: <FaBox size={18} /> },
    // Add new admin links here (e.g., Orders, Dashboard, etc.)
];

const AdminPanel = () => {
    const user = useSelector(state => state?.user?.user);
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        // Redirect if user is not an admin
        if (user && user.role !== ROLE.ADMIN) {
            navigate("/");
        }
    }, [user, navigate]);

    // This functional className is the idiomatic Tailwind way to handle active states
    const navLinkClass = ({ isActive }) => {
        const baseClasses = 'flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors duration-200';
        const activeClasses = 'bg-red-100 text-red-600 font-semibold';
        return isActive ? `${baseClasses} ${activeClasses}` : baseClasses;
    };

    return (
        <div className='min-h-screen md:flex bg-slate-100'>
            {/* --- Sidebar --- */}
            <aside className={`bg-white min-h-full w-64 fixed md:relative left-0 top-0 z-40 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex-shrink-0 border-r border-slate-200`}>
                
                {/* Profile Section */}
                <div className='h-20 flex items-center gap-3 p-4 border-b border-slate-200'>
                    <div className='relative w-12 h-12 flex-shrink-0'>
                        {user?.profilePic ? (
                            <img src={user.profilePic} className='w-full h-full rounded-full object-cover' alt={user.name} />
                        ) : (
                            <FaUserCircle size={48} className="text-slate-400" />
                        )}
                    </div>
                    <div className='truncate'>
                        <p className='capitalize text-md font-semibold text-slate-800 truncate'>{user?.name}</p>
                        <p className='text-xs text-slate-500'>{user?.role}</p>
                    </div>
                </div>

                {/* Navigation */}       
                <nav className='flex flex-col p-4 space-y-2'>
                    {adminNav.map(nav => (
                        <NavLink 
                            to={nav.path} 
                            key={nav.label}
                            onClick={() => setIsSidebarOpen(false)}
                            className={navLinkClass}
                        >
                            {nav.icon}
                            <span>{nav.label}</span>
                        </NavLink>
                    ))}
                </nav>  
            </aside>
            
            {/* --- Main Content Area --- */}
            <div className='flex-grow w-full md:w-auto'>
                {/* Mobile Header */}
                <header className='md:hidden h-16 bg-white flex justify-between items-center px-4 shadow-md sticky top-0 z-20'>
                    <h1 className='text-lg font-semibold text-slate-700'>Admin Panel</h1>
                    <button onClick={() => setIsSidebarOpen(true)} aria-label="Open sidebar">
                        <HiMenuAlt2 size={24} />
                    </button>
                </header>

                {/* Content Outlet */}
                <main className='p-4 md:p-8'>
                    <Outlet />
                </main>
            </div>
            
            {/* --- Overlay for mobile sidebar --- */}
            {isSidebarOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black bg-opacity-40 z-30" 
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
}

export default AdminPanel;