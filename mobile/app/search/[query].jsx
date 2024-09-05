import React, { useContext, useState, useEffect } from "react";
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
import useMyAdmin from "../../lib/useMyAdmin";
import { getAllPosts, getLatestPosts, searchPosts } from "../../lib/myAdmin";
import CityCard from "../../components/CityCard";
import { useLocalSearchParams } from "expo-router";
const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useMyAdmin(() => searchPosts(query));
  useEffect(() => {
    refetch();
  }, [query]);
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CityCard city={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 ">
            <Text className="font-pmedium text-sm text-gray-100">
              Search results for:
            </Text>
            <Text className="text-2xl font-psemibold text-white">{query}</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <Empty
            title="No cities found"
            subtitle="No cities found for this search"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
