import { API } from "@/utils/api";

const loginAccountEmail = async (email: string, password: string) => {
  try {
    const response = await fetch(API.LOGIN_EMAIL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      console.error(
        `Login failed - Status: ${response.status}`,
        JSON.stringify({ email, password })
      );
      throw new Error(`Đăng nhập thất bại - Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("========= Error Login:", error);
    throw error;
  }
};

const loginAccountPhone = async (phone: string, password: string) => {
  try {
    const response = await fetch(API.LOGIN_PHONE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, password }),
    });

    if (!response.ok) {
      console.error(
        `Login failed - Status: ${response.status}`,
        JSON.stringify({ phone, password })
      );
      throw new Error(`Đăng nhập thất bại - Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("========= Error Login:", error);
    throw error;
  }
};

const getAll = async () => {
  try {
    const response = await fetch(API.GET_ALL_ACCOUNTS, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Failed - Status: ${response.status}`);
    }
    const data = await response.json();

    return data;
  } catch (error: any) {
    console.error("========= Error Get All Accounts:", error);
    return false;
  }
};

const getClientAccount = async (id: string) => {
  try {
    const response = await fetch(`${API.GET_CLIENT_ACCOUNT}/${id}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Failed - Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("========= Error Get All Accounts:", error);
    return false;
  }
};

const createClientAccount = async (payload: any) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const response = await fetch(API.CREATE_CLIENT_ACCOUNTS, {
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
    console.error("========= Error Create Account:", error);
    return false;
  }
};

const updateClientAccount = async (id: any, payload: any) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const response = await fetch(`${API.UPDATE_CLIENT_ACCOUNTS}/${id}`, {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(payload),
      redirect: "follow",
    });
    if (!response.ok) {
      console.log("check update: failed", response.status);

      throw new Error(`Failed - Status: ${response.status}`);
    }
    console.log("check update: success", response.status);
    return true;
  } catch (error: any) {
    console.error("========= Error Update Account:", error);
    return false;
  }
};

const deleteAccount = async (id: any) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const response = await fetch(`${API.DELETE_CLIENT_ACCOUNTS}/${id}`, {
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
    console.error("========= Error Delete Account:", error);
    return false;
  }
};

export const AccountService = {
  getAll,
  getClientAccount,
  createClientAccount,
  updateClientAccount,
  deleteAccount,
  loginAccountEmail,
  loginAccountPhone,
};
