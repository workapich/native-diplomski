import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Alert } from "react-native";

const useMyAdmin = (fn) => {
  const { user } = useContext(AuthContext); // Get the user (and token) from context
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // Move fetchData outside of the useEffect to reuse it in refetch
  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await fn(user.token);
      setData(response.data.data);
    } catch (error) {
      Alert.alert(
        "An Error Occurred1!",
        error?.response?.data?.message ?? error.message,
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Call fetchData when the component mounts
  }, []); // Empty dependency array to call only once

  const refetch = () => fetchData(); // Now refetch can access fetchData

  return { data, isLoading, refetch };
};

export default useMyAdmin;
