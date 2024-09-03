import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  Image,
  Text,
  View,
  Button,
  FlatList,
  RefreshControl,
  Alert,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import axios from "axios";

import Empty from "../../components/Empty";
import FindCard from "../../components/FindCard";
import useMyAdmin from "../../lib/useMyAdmin";
import {
  getAllPosts,
  getLatestPayments,
  getActivePlate,
} from "../../lib/myAdmin";
import CityCard from "../../components/CityCard";

const Home = () => {
  const { user } = useContext(AuthContext);

  const { data: posts, isLoading, refetch } = useMyAdmin(getAllPosts);
  const { data: latestPayments, refetch: refetchPayment } =
    useMyAdmin(getLatestPayments);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchPayment(), refetch()]);
    setRefreshing(false);
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CityCard city={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Wellcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  Vladimir
                </Text>
              </View>

              <View className="mt-1.5">
                {/* <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                /> */}
                <Text className="text-2xl font-psemibold text-white">
                  VojPut
                </Text>
              </View>
            </View>

            <SearchInput />
            <FindCard
              title="FIND ME"
              subtitle="Click on the card for a easy search of location"
            />
            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 text-lg font-pregular mb-3">
                Latest Parkings payed
              </Text>
              <Trending
                posts={latestPayments ?? []}
                onRefresh={refetchPayment}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <Empty title="No videos found" subtitle="no videos created yet" />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
