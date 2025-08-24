import React, { useState } from 'react';
import { MdModeEditOutline } from "react-icons/md";
import AdminEditProduct from './AdminEditProduct';
import displayINRCurrency from '../helpers/displayCurrency';

const AdminProductCard = ({
    data,
    fetchdata
}) => {
    const [editProduct, setEditProduct] = useState(false);

    return (
        <div className='bg-white rounded-lg shadow-md p-4 border border-slate-200 hover:shadow-lg hover:border-red-500 transition-all group'>
            <div className='w-full'>
                {/* Product Image Container */}
                <div className='w-full h-48 flex justify-center items-center bg-slate-100 rounded-md overflow-hidden mb-3'>
                    <img 
                        src={data?.productImage[0]} 
                        alt={data.productName}
                        className='object-contain h-full w-full group-hover:scale-105 transition-transform duration-300'
                    />
                </div>

                {/* Product Details */}
                <div className='flex flex-col justify-between'>
                    <h1 
                        className='text-lg font-semibold text-slate-800 text-ellipsis line-clamp-2 min-h-[3rem]'
                        title={data.productName} // Show full name on hover
                    >
                        {data.productName}
                    </h1>

                    <div className='flex justify-between items-center mt-2'>
                        <p className='text-xl font-bold text-red-600'>
                            {displayINRCurrency(data.sellingPrice)}
                        </p>

                        {/* Edit Button */}
                        <button 
                            className='flex items-center justify-center w-10 h-10 bg-green-100 text-green-700 rounded-full hover:bg-green-600 hover:text-white transition-colors cursor-pointer'
                            onClick={() => setEditProduct(true)}
                            aria-label={`Edit ${data.productName}`}
                        >
                            <MdModeEditOutline size={20}/>
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Edit Product Modal */}
            {editProduct && (
                <AdminEditProduct 
                    productData={data} 
                    onClose={() => setEditProduct(false)} 
                    fetchdata={fetchdata}
                />
            )}
        </div>
    );
}

export default AdminProductCard;