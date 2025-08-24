import React, { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { IoFilter, IoClose } from 'react-icons/io5';
import { FaSearch } from 'react-icons/fa';

import SummaryApi from '../common';
import VerticalCard from '../components/VerticalCard';
import productCategory from '../helpers/productCategory'; // Assuming you have this helper

const SearchProduct = () => {
    const location = useLocation();
    const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const searchQuery = query.get('q');
    
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState('');
    const [filterCategory, setFilterCategory] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${SummaryApi.searchProduct.url}?q=${searchQuery}`);
            const dataResponse = await response.json();
            setData(dataResponse.data || []);
        } catch (error) {
            console.error("Failed to fetch search results", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [searchQuery]);

    const handleCategoryChange = (e) => {
        const { value, checked } = e.target;
        setFilterCategory(prev => checked ? [...prev, value] : prev.filter(cat => cat !== value));
    };

    const sortedAndFilteredData = useMemo(() => {
        let processedData = [...data];

        if (filterCategory.length > 0) {
            processedData = processedData.filter(product => filterCategory.includes(product.category));
        }

        if (sortBy === 'asc') {
            processedData.sort((a, b) => a.sellingPrice - b.sellingPrice);
        } else if (sortBy === 'dsc') {
            processedData.sort((a, b) => b.sellingPrice - a.sellingPrice);
        }

        return processedData;
    }, [data, sortBy, filterCategory]);

    const FilterSidebar = () => (
        <div className='bg-white p-4 rounded-lg shadow-md h-fit sticky top-20'>
            <h3 className='text-lg font-semibold border-b pb-2 mb-4'>Filters</h3>
            {/* Sort By */}
            <div>
                <h4 className='font-medium mb-2'>Sort by</h4>
                <div className='space-y-2 text-sm'>
                    <div className='flex items-center gap-2'><input type='radio' name='sortBy' value='asc' checked={sortBy === 'asc'} onChange={(e) => setSortBy(e.target.value)} /><label>Price: Low to High</label></div>
                    <div className='flex items-center gap-2'><input type='radio' name='sortBy' value='dsc' checked={sortBy === 'dsc'} onChange={(e) => setSortBy(e.target.value)} /><label>Price: High to Low</label></div>
                </div>
            </div>
            {/* Filter By Category */}
            <div className='mt-6'>
                <h4 className='font-medium mb-2'>Category</h4>
                <div className='space-y-2 text-sm'>
                    {productCategory.map(category => (
                        <div key={category.value} className='flex items-center gap-2'>
                            <input type='checkbox' id={category.value} value={category.value} checked={filterCategory.includes(category.value)} onChange={handleCategoryChange} />
                            <label htmlFor={category.value}>{category.label}</label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className='container mx-auto p-4 md:p-6'>
            {/* Mobile Filter Button */}
            <button onClick={() => setIsFilterOpen(true)} className='lg:hidden flex items-center gap-2 mb-4 bg-white px-4 py-2 rounded-full shadow-md'>
                <IoFilter /> Filters
            </button>

            {/* Mobile Filter Modal */}
            {isFilterOpen && (
                <div className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'>
                    <div className='bg-slate-100 absolute left-0 top-0 h-full w-72 p-4 overflow-y-auto'>
                        <button onClick={() => setIsFilterOpen(false)} className='absolute top-4 right-4'><IoClose size={24} /></button>
                        <FilterSidebar />
                    </div>
                </div>
            )}
            
            <div className='grid grid-cols-1 lg:grid-cols-[250px,1fr] gap-8'>
                {/* Desktop Sidebar */}
                <aside className='hidden lg:block'>
                    <FilterSidebar />
                </aside>
                
                {/* Product Grid */}
                <main>
                    <p className='text-lg font-semibold mb-4'>
                        Showing results for <span className='text-red-600'>"{searchQuery}"</span>
                        <span className='text-sm text-slate-500 font-normal ml-2'>({sortedAndFilteredData.length} items)</span>
                    </p>
                    
                    {loading && <VerticalCard loading={true} data={[]} />}
                    
                    {!loading && sortedAndFilteredData.length === 0 && (
                        <div className='flex flex-col items-center justify-center text-center p-8 bg-white rounded-lg shadow-sm h-full'>
                            <FaSearch size={50} className="text-slate-300 mb-4" />
                            <h3 className='text-xl font-semibold text-slate-700'>No Results Found</h3>
                            <p className='mt-1 text-slate-500'>Try searching for something else.</p>
                        </div>
                    )}
                    
                    {!loading && sortedAndFilteredData.length > 0 && (
                        <VerticalCard loading={false} data={sortedAndFilteredData} />
                    )}
                </main>
            </div>
        </div>
    );
};

export default SearchProduct;