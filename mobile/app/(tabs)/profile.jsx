import React, { useState, useCallback, useContext, useEffect } from "react";
import {
  Text,
  View,
  FlatList,
  SafeAreaView,
  Alert,
  Button,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import useMyAdmin from "../../lib/useMyAdmin";
import HistoryCard from "../../components/HistoryCard";
import { getLatestPayments } from "../../lib/myAdmin";
import { router } from "expo-router";
import CustomButton from "../../components/CustomButton";

const Profile = () => {
  const { logout, user } = useContext(AuthContext);
  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [latestPayments, setLatestPayments] = useState([]);
  const { data } = useMyAdmin(
    (token, params) => getLatestPayments(token, params),
    { offset: 0, limit: 3 }
  );

  useEffect(() => {
    if (data) {
      setLatestPayments(data);
    }
  }, [data]);
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return; // prevent repeated calls

    setLoadingMore(true);
    try {
      const newParams = { offset: (page + 1) * 3, limit: 3 };
      const response = await getLatestPayments(user.token, newParams);
      if (!response || !response.data || response.data.data.length === 0) {
        setHasMore(false); // No more data to load
      } else {
        if (latestPayments) {
          // check if latestPayments is not undefined
          setLatestPayments([...latestPayments, ...response.data.data]);
        } else {
          setLatestPayments(response.data.data); // set latestPayments to the initial response
        }
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      Alert.alert("Failed to load more payments", error.message);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, page, user.token, latestPayments]);

  const renderFooter = () => {
    if (!loadingMore || !hasMore) return null;
    return <ActivityIndicator size="large" color="#343434" />;
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={latestPayments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <HistoryCard city={item} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3} // increased threshold to prevent infinite loop
        ListFooterComponent={renderFooter}
        ListHeaderComponent={() => (
          <View>
            <View className="my-6 px-4 space-y-6">
              <View className="justify-between items-start flex-row mb-6">
                <View>
                  <Text className="font-pmedium text-sm text-gray-100">
                    Your History
                  </Text>
                  <Text className="text-2xl font-psemibold text-white">
                    {user.username}
                  </Text>
                </View>
                <View className="mt-1.5">
                  <Text className="text-2xl font-psemibold text-white">
                    VP-Logo
                  </Text>
                </View>
              </View>
            </View>
            <View>
              <Text className="text-2xl font-psemibold text-white"></Text>
            </View>
            <View className="justify-center items-center flex-column ">
              <CustomButton
                title="Log out"
                handlePress={logout}
                containerStyles=" w-[200px]"
              />
              <CustomButton
                title="Change Password"
                handlePress={() => router.push(`/password/changePassword`)}
                containerStyles="my-7 w-[200px]"
              />

              {/* <Button title="Logout" onPress={logout} />
              <Button
                title="Change Password?"
                onPress={() => router.push(`/password/changePassword`)}
              /> */}
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
