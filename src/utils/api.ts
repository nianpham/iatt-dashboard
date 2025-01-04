const BASE_URL = 'http://localhost:8000/api/v1';

export const API = {
    // PRODUCT
    GET_ALL_PRODUCTS: `${BASE_URL}/product/get-all`,
    CREATE_PRODUCT: `${BASE_URL}/product/create`,
    UPDATE_PRODUCT: `${BASE_URL}/product/update`,
    DELETE_PRODUCT: `${BASE_URL}/product/delete`,
    // BLOG
    GET_ALL_BLOGS: `${BASE_URL}/blog/get-all`,
    CREATE_BLOG: `${BASE_URL}/blog/create`,
    UPDATE_BLOG: `${BASE_URL}/blog/update`,
    DELETE_BLOG: `${BASE_URL}/blog/delete`,
}