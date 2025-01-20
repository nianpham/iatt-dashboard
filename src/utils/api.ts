// const BASE_URL = 'https://api.inanhtructuyen.com/api/v1';
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
    // ACCOUNT
    GET_ALL_ACCOUNTS: `${BASE_URL}/account/get-all`,
    // ORDER
    GET_ALL_ORDERS: `${BASE_URL}/order/get-all`,
    UPDATE_ORDER: `${BASE_URL}/order/update`,
}