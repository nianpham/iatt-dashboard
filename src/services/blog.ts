import { API } from "@/utils/api";

const getAll = async () => {
  try {
    const response = await fetch(API.GET_ALL_BLOGS, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Failed - Status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error: any) {
    console.error("========= Error Get All Blogs:", error);
    return false;
  }
};

const createBlog = async (payload: any) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    console.log("Check blog create: " + JSON.stringify(payload));

    const response = await fetch(API.CREATE_BLOG, {
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
    console.error("========= Error Create Blog:", error);
    return false;
  }
};

const updateBlog = async (id: any, payload: any) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const response = await fetch(`${API.UPDATE_BLOG}/${id}`, {
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

const deleteBlog = async (id: any) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const response = await fetch(`${API.DELETE_BLOG}/${id}`, {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
      body: JSON.stringify({}),
    });
    if (!response.ok) {
      throw new Error(`Failed - Status: ${response.status}`);
    }
    return true;
  } catch (error: any) {
    console.error("========= Error Delete Blog:", error);
    return false;
  }
};

export const BlogService = {
  getAll,
  createBlog,
  updateBlog,
  deleteBlog,
};
