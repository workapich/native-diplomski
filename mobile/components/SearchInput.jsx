import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { icons } from "../constants";
import { usePathname, router } from "expo-router";
import axios from "axios";

const SearchInput = ({ initialQuery }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (query.length > 2) {
      fetchCities(query);
    } else {
      setCities([]);
    }
  }, [query]);

  const fetchCities = async (query) => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/city/search?query=${query}`
      );
      setCities(response.data.data || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleSelectCity = (city) => {
    router.push(`/search/${city.name}`);
  };

  return (
    <View className="w-full h-auto px-4 bg-black-100 rounded-2xl ">
      <View
        className={`flex-row items-center h-16 rounded-2xl ${
          cities.length > 0 ? "border-b-2 border-gray-300" : ""
        }`}
      >
        <TextInput
          className="text-base mt-0.5 text-white flex-1 font-pregular"
          value={query}
          placeholder="Search for a city"
          placeholderTextColor="#CDCDE0"
          onChangeText={(text) => setQuery(text)}
        />
        <TouchableOpacity
          onPress={() => {
            if (pathname.startsWith("/search")) router.setParams({ query });
            else router.push(`/search/${query}`);
          }}
          className="ml-2"
        >
          <Image
            source={icons.search}
            className="w-5 h-5"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      {cities.length > 0 && (
        <FlatList
          data={cities}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="p-2"
              onPress={() => handleSelectCity(item)}
            >
              <Text className="text-lg text-white">{item.name}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text className="text-white">No cities found.</Text>
          }
          style={{ maxHeight: 200 }} // Adjust height as needed
        />
      )}
    </View>
  );
};

export default SearchInput;
