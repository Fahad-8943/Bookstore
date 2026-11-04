import axiosInstance from "./axiosInstance";
const apiService = async (httpMethod, url, reqBody, reqHeader) => {
  const reqConfig = {
    method: httpMethod,
    url,
    data: reqBody,
    headers: reqHeader,
  };
  try {
    const responce = await axiosInstance(reqConfig);
    return responce;
  } catch (error) {
    return error;
  }
};

export default apiService;
