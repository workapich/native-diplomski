import { View, Text } from "react-native";
import React from "react";

const HistoryCard = ({ city }) => {
  return (
    <View className="flex-col items-start bg-gray-800 p-4 m-2 rounded-lg ">
      <Text className="text-white text-xl font-bold">{city.city_name}</Text>
      <View className="mt-2">
        <Text className="text-gray-400 text-sm">
          Payment Time: {city.payment_time}
        </Text>
        <Text className="text-gray-400 text-sm">Zone: {city.zone_name}</Text>
        <Text className="text-gray-400 text-sm">Price: {city.price} RSD</Text>
      </View>
    </View>
  );
};

export default HistoryCard;
