import React, { useState, useEffect } from 'react';
import { CgClose } from "react-icons/cg";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';

// --- Assumed Imports (from your project structure) ---
import productCategory from '../helpers/productCategory';
import uploadImage from '../helpers/uploadImage';
import SummaryApi from '../common';
import DisplayImage from './DisplayImage'; // Component to show image fullscreen

/**
 * A reusable form input component to keep the code DRY and consistent.
 */
const FormInput = ({ id, label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="font-medium text-gray-700">{label}:</label>
    <input
      id={id}
      {...props}
      className="px-3 py-2 bg-slate-100 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-shadow duration-200"
    />
  </div>
);

const AdminEditProduct = ({
    onClose,
    productData,
    fetchdata
}) => {
  // Initialize state, ensuring no undefined values are passed to controlled components
  const [data, setData] = useState({
    _id: productData?._id || '',
    productName: productData?.productName || '',
    brandName: productData?.brandName || '',
    category: productData?.category || '',
    productImage: productData?.productImage || [],
    description: productData?.description || '',
    price: productData?.price || '',
    sellingPrice: productData?.sellingPrice || ''
  });

  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUploadProduct = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const uploadImageCloudinary = await uploadImage(file);
      if (uploadImageCloudinary.url) {
        setData((prev) => ({
          ...prev,
          productImage: [...prev.productImage, uploadImageCloudinary.url]
        }));
      }
    }
  };

  const handleDeleteProductImage = (indexToDelete) => {
    const newProductImage = data.productImage.filter((_, index) => index !== indexToDelete);
    setData((prev) => ({
      ...prev,
      productImage: newProductImage
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create a payload with only the data, excluding the _id for the body
    const { _id, ...payload } = data;

    const response = await fetch(SummaryApi.updateProduct.url, {
      method: SummaryApi.updateProduct.method,
      credentials: 'include',
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        _id: _id, // Pass the ID in the body as expected by the backend
        ...payload
      })
    });

    const responseData = await response.json();

    if (responseData.success) {
      toast.success(responseData.message);
      onClose(); // Close the modal on success
      if (fetchdata) {
        fetchdata(); // Refresh the product list
      }
    } else {
      toast.error(responseData.message);
    }
  };

  return (
    <div className='fixed w-full h-full bg-black bg-opacity-50 top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50'>
      {/* Modal Container */}
      <div className='bg-white rounded-lg shadow-xl w-full max-w-3xl h-full max-h-[90vh] flex flex-col'>
        
        {/* Modal Header */}
        <div className='flex justify-between items-center px-6 py-4 border-b border-slate-200 flex-shrink-0'>
          <h2 className='font-bold text-xl text-gray-800'>Edit Product</h2>
          <button className='text-2xl text-gray-500 hover:text-red-600 transition-colors' onClick={onClose} aria-label="Close modal">
            <CgClose />
          </button>
        </div>

        {/* Form Content - Main scrollable area */}
        <form className='flex-grow overflow-y-auto p-6 space-y-6' onSubmit={handleSubmit} id="edit-product-form">
          <FormInput
            id="productName"
            label="Product Name"
            type="text"
            placeholder="e.g., Wireless Bluetooth Headphones"
            name="productName"
            value={data.productName}
            onChange={handleOnChange}
            required
          />

          <FormInput
            id="brandName"
            label="Brand Name"
            type="text"
            placeholder="e.g., Sony"
            name="brandName"
            value={data.brandName}
            onChange={handleOnChange}
            required
          />

          <div className="flex flex-col gap-1">
            <label htmlFor="category" className="font-medium text-gray-700">Category:</label>
            <select
              required
              id="category"
              value={data.category}
              name="category"
              onChange={handleOnChange}
              className="px-3 py-2 bg-slate-100 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            >
              <option value="">-- Select Category --</option>
              {productCategory.map((el, index) => (
                <option value={el.value} key={el.value + index}>{el.label}</option>
              ))}
            </select>
          </div>

          {/* Product Image Section */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">Product Images:</label>
            <label htmlFor='uploadImageInput' className='cursor-pointer'>
              <div className='p-4 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg h-32 w-full flex justify-center items-center hover:bg-slate-200 hover:border-red-400 transition-colors'>
                <div className='text-center text-slate-500 flex flex-col items-center gap-2'>
                  <span className='text-5xl'><FaCloudUploadAlt /></span>
                  <p className='text-sm font-semibold'>Upload or Drag Images Here</p>
                  <input type='file' id='uploadImageInput' className='hidden' onChange={handleUploadProduct} accept="image/*" />
                </div>
              </div>
            </label>
            {/* Image Preview */}
            <div>
              {data.productImage.length > 0 ? (
                <div className='flex items-center flex-wrap gap-3 mt-2'>
                  {data.productImage.map((imgUrl, index) => (
                    <div className='relative group w-24 h-24' key={imgUrl + index}>
                      <img
                        src={imgUrl}
                        alt="product preview"
                        className='w-full h-full object-cover bg-slate-100 border rounded-md cursor-pointer'
                        onClick={() => {
                          setOpenFullScreenImage(true);
                          setFullScreenImage(imgUrl);
                        }}
                      />
                      <button
                        type="button" // Important: prevents form submission on click
                        className='absolute -top-2 -right-2 p-1 text-white bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110'
                        onClick={() => handleDeleteProductImage(index)}
                        aria-label="Delete image"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-sm text-red-600 mt-2'>* Please upload at least one product image.</p>
              )}
            </div>
          </div>

          {/* Price Fields */}
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
              min="0"
              step="0.01"
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
              min="0"
              step="0.01"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="font-medium text-gray-700">Description:</label>
            <textarea
              id="description"
              className='h-32 bg-slate-100 border border-slate-300 resize-none p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition'
              placeholder='Describe the product features, materials, etc...'
              name='description'
              value={data.description}
              onChange={handleOnChange}
            />
          </div>
        </form>

        {/* Modal Footer (Action Button) */}
        <div className='px-6 py-4 border-t border-slate-200 bg-white flex-shrink-0'>
           <button 
             type="submit" 
             form="edit-product-form" // Links this button to the form
             className='w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
           >
             Update Product
           </button>
        </div>
      </div>

      {/* Full-screen image display modal */}
      {openFullScreenImage && (
        <DisplayImage onClose={() => setOpenFullScreenImage(false)} imgUrl={fullScreenImage} />
      )}
    </div>
  );
};

export default AdminEditProduct;