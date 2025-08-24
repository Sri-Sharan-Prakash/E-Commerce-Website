import React, { useEffect, useState } from 'react';
import { CgClose } from 'react-icons/cg';
import { FaSpinner } from 'react-icons/fa'; // Using a spinner icon

const DisplayImage = ({ imgUrl, onClose }) => {
    const [isLoading, setIsLoading] = useState(true);

    // Effect to handle the 'Escape' key press for closing the modal
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Cleanup function to remove the event listener
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    // Prevents the modal from closing when the image itself is clicked
    const handleImageClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div 
            className='fixed top-0 bottom-0 left-0 right-0 w-full h-full z-50 flex justify-center items-center bg-black bg-opacity-70 animate-fade-in'
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Image Preview"
        >
            {/* Close Button - Positioned at the top right of the viewport */}
            <button 
                className='absolute top-4 right-4 text-white text-3xl z-50 p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors' 
                onClick={onClose}
                aria-label="Close image preview"
            >
                <CgClose />
            </button>

            {/* Image Container */}
            <div 
                className='flex justify-center items-center max-w-[90vw] max-h-[90vh] animate-zoom-in'
                onClick={handleImageClick} // Prevent closing when clicking the image/container
            >
                {/* Loading Spinner */}
                {isLoading && (
                    <div className='text-white text-4xl'>
                        <FaSpinner className='animate-spin' />
                    </div>
                )}

                {/* The Actual Image */}
                <img
                    src={imgUrl}
                    alt="Full screen product view"
                    className={`object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => setIsLoading(false)}
                    style={{ maxHeight: '90vh', maxWidth: '90vw' }} // Redundant but safe inline styles
                />
            </div>
        </div>
    );
}

export default DisplayImage;