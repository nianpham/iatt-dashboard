const BASE_URL = "https://api.farmcode.io.vn/v1";
// const BASE_URL = "http://localhost:8000/v1";

export const API = {
  //LOGIN
  LOGIN_EMAIL: `${BASE_URL}/inanhtructuyen/auth/login-email-admin`,
  LOGIN_PHONE: `${BASE_URL}/inanhtructuyen/auth/login-phone-admin`,
  // PRODUCT
  GET_ALL_PRODUCTS: `${BASE_URL}/inanhtructuyen/product/`,
  GET_ALL_PRODUCTS_W_DELETED: `${BASE_URL}/inanhtructuyen/product-with-deleted/`,
  GET_PRODUCT: `${BASE_URL}/inanhtructuyen/product`,
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
  GET_CLIENT_ACCOUNT: `${BASE_URL}/inanhtructuyen/account`,
  CREATE_CLIENT_ACCOUNTS: `${BASE_URL}/inanhtructuyen/account`,
  UPDATE_CLIENT_ACCOUNTS: `${BASE_URL}/inanhtructuyen/account/update`,
  DELETE_CLIENT_ACCOUNTS: `${BASE_URL}/inanhtructuyen/account`,
  GET_ACCOUNT_BY_ID: `${BASE_URL}/inanhtructuyen/account`,
  // ORDER
  GET_ALL_ORDERS: `${BASE_URL}/inanhtructuyen/order/`,
  UPDATE_ORDER: `${BASE_URL}/inanhtructuyen/order`,
  DOWNLOAD_IMAGE: `${BASE_URL}/inanhtructuyen/download`,
  CREATE: `${BASE_URL}/inanhtructuyen/order/`,
  DELETE_ORDER: `${BASE_URL}/inanhtructuyen/order`,
  // DISCOUNT
  GET_ALL_DISCOUNTS: `${BASE_URL}/inanhtructuyen/discount`,
  GET_DISCOUNT: `${BASE_URL}/inanhtructuyen/discount`,
  CREATE_DISCOUNT: `${BASE_URL}/inanhtructuyen/discount`,
  UPDATE_DISCOUNT: `${BASE_URL}/inanhtructuyen/discount`,
  DELETE_DISCOUNT: `${BASE_URL}/inanhtructuyen/discount`,
  CHECK_DISCOUNT: `${BASE_URL}/inanhtructuyen/discount-check`,
};
