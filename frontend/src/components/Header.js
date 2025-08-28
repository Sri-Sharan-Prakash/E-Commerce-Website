import React, { useContext, useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GrSearch } from 'react-icons/gr';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';

import Logo from './Logo';
import SummaryApi from '../common';
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';
import Context from '../context';

// Reusable Icon Button for consistency
const IconButton = ({ children, onClick, ariaLabel, className = '' }) => (
    <button onClick={onClick} aria-label={ariaLabel} className={`relative flex justify-center items-center text-2xl text-slate-700 hover:text-red-600 transition-colors ${className}`}>
        {children}
    </button>
);

// User Menu Dropdown Component
const UserMenu = ({ user, onLogout, onClose }) => {
    const menuRef = useRef(null);

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div ref={menuRef} className='absolute bg-white right-0 top-12 w-56 rounded-lg shadow-xl animate-fade-in-down z-50 overflow-hidden'>
            <div className='p-4 border-b border-slate-200'>
                <p className='font-semibold text-slate-800 truncate'>{user?.name}</p>
                <p className='text-sm text-slate-500 truncate'>{user?.email}</p>
            </div>
            <nav className='flex flex-col p-2'>
                {user?.role === ROLE.ADMIN && (
                    <Link to="/admin-panel/all-products" onClick={onClose} className='px-4 py-2 rounded-md hover:bg-slate-100 transition-colors'>Admin Panel</Link>
                )}
                {/* Add other links like "My Profile", "Orders" here */}
                <Link to="/profile" onClick={onClose} className='px-4 py-2 rounded-md hover:bg-slate-100 transition-colors'>My Profile</Link>
            </nav>
            <div className='p-2 border-t border-slate-200'>
                 <button onClick={() => { onLogout(); onClose(); }} className='w-full text-left px-4 py-2 rounded-md text-red-600 font-semibold hover:bg-red-50 transition-colors'>
                    Logout
                 </button>
            </div>
        </div>
    );
};

// Mobile Search Overlay Component
const MobileSearch = ({ isOpen, onClose, onSearch, initialValue }) => {
    const [searchValue, setSearchValue] = useState(initialValue);

    useEffect(() => {
        setSearchValue(initialValue);
    }, [initialValue]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSearch(searchValue);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-white z-50 animate-fade-in md:hidden'>
            <div className='container mx-auto p-4'>
                <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-xl font-semibold'>Search Products</h2>
                    <IconButton onClick={onClose} ariaLabel="Close search">
                        <IoMdClose size={28}/>
                    </IconButton>
                </div>
                <form onSubmit={handleFormSubmit} className='flex items-center w-full border-b-2 border-red-500'>
                    <input
                        type='text'
                        placeholder='Search for products...'
                        className='w-full text-lg outline-none py-2'
                        onChange={(e) => setSearchValue(e.target.value)}
                        value={searchValue}
                        autoFocus
                    />
                    <button type="submit" className='text-2xl text-slate-500'>
                        <GrSearch />
                    </button>
                </form>
            </div>
        </div>
    );
};


const Header = () => {
    const user = useSelector(state => state?.user?.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { cartProductCount } = useContext(Context);

    const [menuDisplay, setMenuDisplay] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    
    const URLSearch = new URLSearchParams(location.search);
    const searchQuery = URLSearch.get("q") || "";
    const [search, setSearch] = useState(searchQuery);

    useEffect(() => {
        setSearch(searchQuery);
    }, [location.search]);

    const handleLogout = useCallback(async () => {
        const response = await fetch(SummaryApi.logout_user.url, {
            method: SummaryApi.logout_user.method,
            credentials: 'include',
        });
        const data = await response.json();

        if (data.success) {
            toast.success(data.message);
            dispatch(setUserDetails(null));
            navigate("/");
        } else {
            toast.error(data.message);
        }
    }, [dispatch, navigate]);

    const handleSearch = (value) => {
        setSearch(value);
        if (value) {
            navigate(`/search?q=${value}`);
        } else {
            navigate("/search");
        }
    };

    return (
        <header className='h-16 shadow-md bg-white fixed w-full z-40'>
            <div className='h-full container mx-auto flex items-center px-4 justify-between'>
                {/* Logo */}
                <div className='flex-shrink-0'>
                    <Link to={"/"}>
                        <Logo w={90} h={50}/>
                    </Link>
                </div>

                {/* Desktop Search Bar */}
                <div className='hidden md:flex items-center w-full max-w-lg mx-6'>
                    <form onSubmit={(e) => { e.preventDefault(); handleSearch(search); }} className='flex items-center w-full border rounded-full focus-within:ring-2 focus-within:ring-red-500 transition-shadow'>
                        <input
                            type='text'
                            placeholder='Search for products, brands and more'
                            className='w-full outline-none pl-4 pr-2 py-2 rounded-l-full'
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                        />
                        <button type="submit" className='text-lg w-14 h-10 flex items-center justify-center rounded-r-full hover:bg-slate-100 transition-colors'>
                            <GrSearch />
                        </button>
                    </form>
                </div>

                {/* Header Actions */}
                <div className='flex items-center gap-4 md:gap-6'>
                    {/* Mobile Search Icon */}
                    <div className='md:hidden'>
                        <IconButton onClick={() => setMobileSearchOpen(true)} ariaLabel="Open search">
                           <GrSearch />
                        </IconButton>
                    </div>

                    {/* User Menu */}
                    <div className='relative'>
                        <IconButton onClick={() => setMenuDisplay(prev => !prev)} ariaLabel="User menu">
                            {user?.profilePic ? (
                                <img src={user.profilePic} className='w-8 h-8 rounded-full object-cover' alt={user.name} />
                            ) : user?
                                <FaUserCircle size={28}/>:""
                            }
                        </IconButton>
                        {menuDisplay && user && <UserMenu user={user} onLogout={handleLogout} onClose={() => setMenuDisplay(false)} />}
                    </div>
                    
                    {/* Cart */}
                    {user?._id && (
                        <IconButton onClick={() => navigate("/cart")} ariaLabel="Shopping cart">
                            <FaShoppingCart/>
                            <div className='bg-red-600 text-white w-5 h-5 text-xs rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3'>
                                {cartProductCount}
                            </div>
                        </IconButton>
                    )}

                    {/* Login/Logout Button */}
                    {!user?._id && (
                        <Link to={"/login"} className='px-4 py-2 text-sm rounded-full text-white bg-red-600 hover:bg-red-700 transition-colors'>
                            Login
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Search Overlay */}
            <MobileSearch 
                isOpen={mobileSearchOpen} 
                onClose={() => setMobileSearchOpen(false)}
                onSearch={handleSearch}
                initialValue={search}
            />
        </header>
    );
}

export default Header;