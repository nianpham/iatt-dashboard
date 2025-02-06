import { API } from "@/utils/api";

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

export const AccountService = {
  getAll,
};
