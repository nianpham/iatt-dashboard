import { API } from "@/utils/api";

const getAll = async () => {
    try {
        const response = await fetch(
            API.GET_ALL_PRODUCTS,
            {
                method: 'GET',
            },
        );
        if (!response.ok) {
            throw new Error(`Failed - Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error('========= Error Get All Products:', error);
        return false;
    }
};

const createProduct = async (payload: any) => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const response = await fetch(
            API.CREATE_PRODUCT,
            {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(payload),
                redirect: "follow"
            },
        );
        if (!response.ok) {
            throw new Error(`Failed - Status: ${response.status}`);
        }
        return true;
    } catch (error: any) {
        console.error('========= Error Create Product:', error);
        return false;
    }
};

const updateProduct = async (id: any, payload: any) => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        console.log("check update: " + JSON.stringify(payload));
        
        const response = await fetch(
            `${API.UPDATE_PRODUCT}/${id}`,
            {
                method: 'PUT',
                headers: myHeaders,
                body: JSON.stringify(payload),
                redirect: "follow"
            },
        );
        if (!response.ok) {
            console.log("check create: failed", response.status);
            
            throw new Error(`Failed - Status: ${response.status}`);
        }
        console.log("check create: success", response.status);
        return true;
    } catch (error: any) {
        console.error('========= Error Update Product:', error);
        return false;
    }
};

const deleteProduct = async (id: any) => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const response = await fetch(
            `${API.DELETE_PRODUCT}/${id}`,
            {
                method: 'DELETE',
                headers: myHeaders,
                redirect: "follow",
                body: JSON.stringify({})
            },
        );
        if (!response.ok) {
            throw new Error(`Failed - Status: ${response.status}`);
        }
        return true;
    } catch (error: any) {
        console.error('========= Error Delete Product:', error);
        return false;
    }
};

export const ProductService = {
    getAll,
    createProduct,
    updateProduct,
    deleteProduct
};
