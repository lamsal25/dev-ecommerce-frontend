import axios from "axios";
import getAccessToken from "@/helpers/getaccesstoken";
import getCsrfToken from "@/helpers/getcsrftoken";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

// Add request interceptor to inject tokens into every request
API.interceptors.request.use(
  async (config) => {
    const access_token = await getAccessToken();
    const csrftoken = await getCsrfToken();

    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }

    if (csrftoken) {
      config.headers["X-CSRFToken"] = csrftoken;
    }

    if (
      config.data instanceof FormData &&
      config.headers["Content-Type"] === "multipart/form-data"
    ) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let queue: any[] = [];

const processQueue = (err: any = null) => {
  console.log(`Processing queue with ${queue.length} items`, err ? 'Error:' : 'Success', err);
  queue.forEach((p) => {
    if (err) {
      p.reject(err);
    } else {
      p.resolve();
    }
  });
  queue = [];
};

// Response interceptor for refresh token handling
API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const { config, response } = err;
    
    if (response?.status === 401 && !config._retry) {
      console.log("Unauthorized request, attempting to refresh token...");
      
      if (isRefreshing) {
        console.log("Already refreshing token, queuing request");
        return new Promise((resolve, reject) => {
          queue.push({ 
            resolve: () => {
              console.log("Processing queued request after refresh");
              resolve(API(config));
            }, 
            reject: (error:any) => {
              console.log("Rejecting queued request:", error);
              reject(error);
            }
          });
        });
      }

      config._retry = true;
      isRefreshing = true;

      try {
        console.log("Attempting to refresh token...");
        // Use raw axios instead of API to bypass interceptors
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/token/refresh/`,
          {},
          { 
            withCredentials: true,
          }
        );
        console.log("Token refresh successful");
        processQueue(null);
        isRefreshing = false;
        return API(config);
      } catch (refreshErr) {
        console.log("Token refresh failed:", refreshErr);
        processQueue(refreshErr);
        isRefreshing = false;
        
        // Handle server-side vs client-side differently
        if (typeof window !== "undefined") {
          // Client-side: redirect to login
          // window.location.href = "/login";
        } else {
          // Server-side: just log and reject
          console.log("Server-side: Refresh token failed, user not authenticated");
        }
        
        // Always reject with the original 401 error, not the refresh error
        return Promise.reject(err);
      }
    }
    
    return Promise.reject(err);
  }
);

export default API;