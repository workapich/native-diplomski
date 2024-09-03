import axios from "axios";

// Fetch posts with user token passed as an argument
export const getAllPosts = async (token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/city`, config);
};
export const getLatestPosts = async (token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.get(
    `${process.env.EXPO_PUBLIC_API_URL}/city/active`,
    config
  );
};
export const searchPosts = async (query) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return await axios.get(
    `${process.env.EXPO_PUBLIC_API_URL}/city/search?query=${query}`,
    config
  );
};

export const specialCity = async (query) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return await axios.get(
    `${process.env.EXPO_PUBLIC_API_URL}/city/exact?zones=${query}`,
    config
  );
};

export const getAllPlates = async (token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/plate`, config);
};
export const deletePlate = async (token, number) => {
  console.log("Token:", token, "| Number:", number);
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.delete(
    `${process.env.EXPO_PUBLIC_API_URL}/plate/${number}`,
    config
  );
};

export const updateActive = async (token, number, label) => {
  console.log("Token:", token, "| Number:", label);
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.put(
    `${process.env.EXPO_PUBLIC_API_URL}/plate/${number}`,
    {}, // Assuming you want to set the plate as active
    config
  );
};

export const getActivePlate = async (token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.get(
    `${process.env.EXPO_PUBLIC_API_URL}/plate/active`,
    config
  );
};

export const addPayment = async (token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.post(
    `${process.env.EXPO_PUBLIC_API_URL}/history/addPayment`,
    config
  );
};

export const getLatestPayments = async (token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.get(
    `${process.env.EXPO_PUBLIC_API_URL}/history?limit`,
    config
  );
};
