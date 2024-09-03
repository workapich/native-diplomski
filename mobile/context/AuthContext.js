import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { useRouter } from "expo-router";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await SecureStore.getItemAsync("userData");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          console.log("Loaded user data from SecureStore:", userData);
          // Ensure activePlate is initialized
          setUser({
            ...userData,
            activePlate: userData.activePlate || null,
          });
        }
      } catch (error) {
        console.error("Error loading stored user data", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const login = async (email, password) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/users/login`,
        { email, password },
        config
      );

      const userData = {
        id: data.data.id,
        firstName: data.data.firstName,
        lastName: data.data.lastName,
        email: data.data.email,
        token: data.data.token,
        activePlate: data.data.activeId,
      };

      const stringifiedUserData = JSON.stringify(userData);
      await SecureStore.setItemAsync("userData", stringifiedUserData);

      setUser(userData); // Update user state with the logged-in user data
      router.replace("/(tabs)/home"); // Navigate to the home page after login
    } catch (error) {
      console.error(
        "Login error",
        error.response?.data?.message || error.message
      );
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  const logout = async () => {
    try {
      router.replace("/sign-in"); // Navigate to the sign-in page after logout

      await SecureStore.deleteItemAsync("userData");
      setUser(null); // Clear user state
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
