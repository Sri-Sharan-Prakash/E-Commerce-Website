import React, { useState } from 'react';
import { CgClose } from "react-icons/cg";
import { FaCloudUploadAlt, FaSpinner } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';

import productCategory from '../helpers/productCategory';
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import SummaryApi from '../common';

// Reusable Form Input component for consistency and clean code
const FormInput = ({ id, label, ...props }) => (
    <div>
        <label htmlFor={id} className='block text-sm font-medium text-slate-700 mb-1'>{label}:</label>
        <input
            id={id}
            {...props}
            className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition"
        />
    </div>
);

const UploadProduct = ({ onClose, fetchData }) => {
    const [data, setData] = useState({
        productName: "",
        brandName: "",
        category: "",
        productImage: [],
        description: "",
        price: "",
        sellingPrice: ""
    });
    const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
    const [fullScreenImage, setFullScreenImage] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUploadProduct = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const uploadImageCloudinary = await uploadImage(file);
            setData((prev) => ({
                ...prev,
                productImage: [...prev.productImage, uploadImageCloudinary.url]
            }));
        }
    };

    const handleDeleteProductImage = (indexToDelete) => {
        const newProductImage = data.productImage.filter((_, index) => index !== indexToDelete);
        setData((prev) => ({ ...prev, productImage: newProductImage }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            const response = await fetch(SummaryApi.uploadProduct.url, {
                method: SummaryApi.uploadProduct.method,
                credentials: 'include',
                headers: { "content-type": "application/json" },
                body: JSON.stringify(data)
            });
            const responseData = await response.json();

            if (responseData.success) {
                toast.success(responseData.message);
                onClose();
                fetchData();
            } else {
                toast.error(responseData.message);
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className='fixed w-full h-full bg-black bg-opacity-60 top-0 left-0 flex justify-center items-center z-50'>
            <div className='bg-white rounded-lg shadow-2xl w-full max-w-2xl h-full max-h-[90vh] flex flex-col animate-zoom-in'>

                {/* --- Modal Header --- */}
                <div className='flex justify-between items-center px-6 py-4 border-b border-slate-200'>
                    <h2 className='font-bold text-xl text-slate-800'>Upload Product</h2>
                    <button className='p-2 rounded-full hover:bg-slate-100' onClick={onClose}>
                        <CgClose size={22} className="text-slate-600" />
                    </button>
                </div>

                {/* --- Form Body (Scrollable) --- */}
                <form className='flex-grow overflow-y-auto p-6 space-y-6' onSubmit={handleSubmit} id="upload-product-form">
                    <FormInput
                        id="productName"
                        label="Product Name"
                        type="text"
                        placeholder="e.g., Premium Wireless Headphones"
                        name="productName"
                        value={data.productName}
                        onChange={handleOnChange}
                        required
                    />
                    <FormInput
                        id="brandName"
                        label="Brand Name"
                        type="text"
                        placeholder="e.g., BrandX"
                        name="brandName"
                        value={data.brandName}
                        onChange={handleOnChange}
                        required
                    />

                    <div>
                        <label htmlFor='category' className='block text-sm font-medium text-slate-700 mb-1'>Category:</label>
                        <select required value={data.category} name='category' onChange={handleOnChange} className='w-full p-2 bg-slate-100 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'>
                            <option value="">-- Select Category --</option>
                            {productCategory.map((el) => (
                                <option value={el.value} key={el.value}>{el.label}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className='block text-sm font-medium text-slate-700 mb-1'>Product Images:</label>
                        <label htmlFor='uploadImageInput'>
                            <div className='p-4 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg h-32 w-full flex justify-center items-center cursor-pointer hover:border-red-500 hover:bg-slate-50 transition'>
                                <div className='text-center text-slate-500'>
                                    <FaCloudUploadAlt size={40} className="mx-auto" />
                                    <p className='text-sm mt-2'>Drag & Drop or Click to Upload</p>
                                </div>
                                <input type='file' id='uploadImageInput' className='hidden' onChange={handleUploadProduct} accept="image/*" />
                            </div>
                        </label>
                        <div>
                            {data.productImage.length > 0 ? (
                                <div className='flex items-center flex-wrap gap-3 mt-3'>
                                    {data.productImage.map((el, index) => (
                                        <div className='relative group w-24 h-24' key={index}>
                                            <img src={el} alt="product preview" className='w-full h-full object-cover rounded-md border border-slate-200 cursor-pointer' onClick={() => { setOpenFullScreenImage(true); setFullScreenImage(el); }} />
                                            <button type="button" className='absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity' onClick={() => handleDeleteProductImage(index)}>
                                                <MdDelete />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className='text-red-600 text-xs mt-1'>* Please upload at least one product image.</p>
                            )}
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <FormInput
                            id="price"
                            label="Original Price ($)"
                            type="number"
                            placeholder="e.g., 199.99"
                            value={data.price}
                            name="price"
                            onChange={handleOnChange}
                            required
                        />
                        <FormInput
                            id="sellingPrice"
                            label="Selling Price ($)"
                            type="number"
                            placeholder="e.g., 99.99"
                            value={data.sellingPrice}
                            name="sellingPrice"
                            onChange={handleOnChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor='description' className='block text-sm font-medium text-slate-700 mb-1'>Description:</label>
                        <textarea className='w-full h-28 bg-slate-100 border border-slate-300 rounded-md resize-none p-2 focus:outline-none focus:ring-2 focus:ring-red-500' placeholder='Enter product description...' onChange={handleOnChange} name='description' value={data.description}></textarea>
                    </div>
                </form>

                {/* --- Modal Footer --- */}
                <div className='px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-lg'>
                    <button
                        type="submit"
                        form="upload-product-form"
                        className='w-full px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex justify-center items-center disabled:bg-red-400 disabled:cursor-not-allowed'
                        disabled={isUploading}
                    >
                        {isUploading ? <FaSpinner className="animate-spin" /> : 'Upload Product'}
                    </button>
                </div>
            </div>

            {/* Full-screen image display */}
            {openFullScreenImage && (
                <DisplayImage onClose={() => setOpenFullScreenImage(false)} imgUrl={fullScreenImage} />
            )}
        </div>
    );
};

export default UploadProduct;