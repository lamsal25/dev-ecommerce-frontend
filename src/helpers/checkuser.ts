import API from "@/lib/api";

export const checkUser = async () => {
  try {
     const response=await API.get(`/api/getuser/`);
    const data = await response.data;
    return data;
  } catch (err) {
    console.error("Auth check failed:", err);
    return null;
  }
};