const BASE_URL = "https://api.farmcode.io.vn/v1";
// const BASE_URL = 'http://localhost:8000/api/v1';

export const API = {
  // PRODUCT
  GET_ALL_PRODUCTS: `${BASE_URL}/inanhtructuyen/product/`,
  CREATE_PRODUCT: `${BASE_URL}/inanhtructuyen/product/`,
  UPDATE_PRODUCT: `${BASE_URL}/inanhtructuyen/product`,
  DELETE_PRODUCT: `${BASE_URL}/inanhtructuyen/product`,
  // BLOG
  GET_ALL_BLOGS: `${BASE_URL}/inanhtructuyen/blog/`,
  CREATE_BLOG: `${BASE_URL}/inanhtructuyen/blog/`,
  UPDATE_BLOG: `${BASE_URL}/inanhtructuyen/blog`,
  DELETE_BLOG: `${BASE_URL}/inanhtructuyen/blog`,
  // ACCOUNT
  GET_ALL_ACCOUNTS: `${BASE_URL}/inanhtructuyen/account/`,
  // ORDER
  GET_ALL_ORDERS: `${BASE_URL}/inanhtructuyen/order/`,
  UPDATE_ORDER: `${BASE_URL}/inanhtructuyen/order`,
  DOWNLOAD_IMAGE: `${BASE_URL}/inanhtructuyen/download/`,
};
