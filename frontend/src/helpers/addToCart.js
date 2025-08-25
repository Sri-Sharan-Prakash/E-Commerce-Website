import { toast } from 'react-toastify';
import SummaryApi from '../common';

const addToCart = async (productId, quantity) => {

    try {
        const response = await fetch(SummaryApi.addToCartProduct.url, {
            method: SummaryApi.addToCartProduct.method,
            credentials: 'include',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                productId: productId,
                quantity: quantity 
            })
        });

        const responseData = await response.json();

        if (responseData.success) {
            toast.success(responseData.message);
        } else {
            // Use an else block for clearer logic
            toast.error(responseData.message);
        }

        return responseData; // Always return the response from the API

    } catch (error) {
        // This block catches network errors or server crashes, preventing a crash.
        toast.error("An error occurred. Please try again.");
        console.error("Add to Cart Helper Error:", error);
        // Return a consistent error shape so the calling component doesn't crash
        return { success: false, message: "Network error or server is down." };
    }
};

export default addToCart;