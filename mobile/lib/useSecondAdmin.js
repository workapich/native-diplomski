import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Alert } from "react-native";

const useMyAdmin = (fn) => {
  const { user } = useContext(AuthContext); // Get the user (and token) from context
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Set to false initially

  const trigger = async (params = null) => {
    setIsLoading(true);

    try {
      const response = await fn(user.token, params);
      setData(response.data.data);
    } catch (error) {
      Alert.alert(
        "An Error Occurred!",
        error?.response?.data?.message ?? error.message,
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, trigger };
};

export default useMyAdmin;
