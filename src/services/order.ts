import { API } from "@/utils/api";

const getAll = async () => {
  try {
    const response = await fetch(API.GET_ALL_ORDERS, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Failed - Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("========= Error Get All Blogs:", error);
    return false;
  }
};

const updateOrder = async (id: any, payload: any) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const response = await fetch(`${API.UPDATE_ORDER}/${id}`, {
      method: "PUT",
      headers: myHeaders,
      body: JSON.stringify(payload),
      redirect: "follow",
    });
    if (!response.ok) {
      throw new Error(`Failed - Status: ${response.status}`);
    }
    return true;
  } catch (error: any) {
    console.error("========= Error Update Blog:", error);
    return false;
  }
};

const downloadImage = async (payload: any) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const response = await fetch(`${API.DOWNLOAD_IMAGE}`, {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(payload),
      redirect: "follow",
    });
    if (!response.ok) {
      throw new Error(`Failed - Status: ${response.status}`);
    }
    return true;
  } catch (error: any) {
    console.error("========= Error Download IMG:", error);
    return false;
  }
};

export const OrderService = {
  getAll,
  updateOrder,
  downloadImage,
};
