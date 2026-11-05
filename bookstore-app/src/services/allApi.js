import apiService from "../api/apiService";

// register Api
export const registerAPI = async (userData) => {
  return await apiService("POST", "/register", userData);
};
// login api
export const loginAPI = async (userData) => {
  return await apiService("POST", "/login", userData);
};

// google login api
export const googleLoginAPI = async (userData) => {
  return await apiService("POST", "/google-login", userData);
};
// profile update
export const updateUserProfileAPI = async (userId, formData) => {
  return await apiService("PUT", `/user/edit/${userId}`, formData);
};

// add-books
export const addBookAPI = async (bookData) => {
  return await apiService("POST", "/add-book", bookData);
};

// get home page books

export const getHomePageBooksAPI = async () => {
  return await apiService("GET", "/home-books", {});
};
// get all books
export const getAllBooksAPI = async (searchKey) => {
  return await apiService("GET", `/all-books?search=${searchKey}`, {});
};
// get user books
export const getUserBooksAPI = async () => {
  return await apiService("GET", "/user-books", {});
};
// get bought books
export const getBoughtBooksAPI = async () => {
  return await apiService("GET", "/bought-books", {});
};
// get single book details
export const getSingleBooksAPI = async (id) => {
  return await apiService("GET", `/single-book/${id}`, {});
};
// remove book
export const removeBookAPI = async (id) => {
  return await apiService("DELETE", `/remove-book/${id}`, {});
};

// make-payment api
export const makePaymentAPI = async (id) => {
  return await apiService("GET", `/make-payment/${id}`, {});
};
// verify payment
export const verifyPaymentAPI = async (reqBody) => {
  return await apiService("POST", `/verify-payment`, reqBody);
};

export const adminBooksAPI = async () => {
  return await apiService("GET", `/books`, {});
};

export const editBookStatusAPI = async (id) => {
  return await apiService("PUT", `/book-update/${id}`, {});
};

export const getAllUserAPI = async () => {
  return await apiService("GET", "/all-users", {});
};

export const bookAbstractAPI = async (title) => {
  return await apiService("POST", `/books-ai`, {title});
};
