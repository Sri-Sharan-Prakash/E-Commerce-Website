import React, { useEffect, useState, useCallback } from 'react';

// Import your images
import image1 from '../assest/banner/img1.webp';
import image2 from '../assest/banner/img2.webp';
import image3 from '../assest/banner/img3.jpg';
import image4 from '../assest/banner/img4.jpg';
import image5 from '../assest/banner/img5.webp';

import image1Mobile from '../assest/banner/img1_mobile.jpg';
import image2Mobile from '../assest/banner/img2_mobile.webp';
import image3Mobile from '../assest/banner/img3_mobile.jpg';
import image4Mobile from '../assest/banner/img4_mobile.jpg';
import image5Mobile from '../assest/banner/img5_mobile.png';

import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";

const BannerProduct = () => {
    const [currentImage, setCurrentImage] = useState(0);

    const desktopImages = [image1, image2, image3, image4, image5];
    const mobileImages = [image1Mobile, image2Mobile, image3Mobile, image4Mobile, image5Mobile];

    const nextImage = useCallback(() => {
        setCurrentImage((prev) => (prev === desktopImages.length - 1 ? 0 : prev + 1));
    }, [desktopImages.length]);

    const prevImage = () => {
        setCurrentImage((prev) => (prev === 0 ? desktopImages.length - 1 : prev - 1));
    };

    const goToImage = (index) => {
        setCurrentImage(index);
    };

    useEffect(() => {
        const interval = setInterval(nextImage, 5000);
        return () => clearInterval(interval);
    }, [nextImage]);

    return (
        <div className='container mx-auto px-4 rounded mt-4'>
            <div className='h-56 md:h-72 w-full bg-slate-200 relative overflow-hidden rounded-lg'>
                
                {/* Image container for sliding effect */}
                <div className='w-full h-full flex transition-transform duration-500 ease-in-out' style={{ transform: `translateX(-${currentImage * 100}%)` }}>
                    {/* Desktop Images */}
                    <div className='hidden md:flex w-full h-full'>
                        {desktopImages.map((imageUrl, index) => (
                            <div className='w-full h-full min-w-full flex-shrink-0' key={`desktop-${index}`}>
                                <img src={imageUrl} className='w-full h-full object-cover' alt={`Banner ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                    {/* Mobile Images */}
                    <div className='flex md:hidden w-full h-full'>
                        {mobileImages.map((imageUrl, index) => (
                            <div className='w-full h-full min-w-full flex-shrink-0' key={`mobile-${index}`}>
                                <img src={imageUrl} className='w-full h-full object-cover' alt={`Banner ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className='absolute top-1/2 -translate-y-1/2 w-full flex justify-between items-center px-4'>
                    <button onClick={prevImage} className='bg-white/50 backdrop-blur-sm shadow-md rounded-full p-2 hover:bg-white transition-colors' aria-label="Previous image">
                        <FaAngleLeft size={24} />
                    </button>
                    <button onClick={nextImage} className='bg-white/50 backdrop-blur-sm shadow-md rounded-full p-2 hover:bg-white transition-colors' aria-label="Next image">
                        <FaAngleRight size={24} />
                    </button>
                </div>

                {/* Indicator Dots */}
                <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3'>
                    {desktopImages.map((_, index) => (
                        <button 
                            key={`dot-${index}`}
                            onClick={() => goToImage(index)}
                            className={`w-3 h-3 rounded-full transition-all ${currentImage === index ? 'bg-white scale-125' : 'bg-white/50'}`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default BannerProduct;