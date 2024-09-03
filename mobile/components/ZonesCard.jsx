import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { zoneColors } from "../constants/colors";

const ZonesCard = ({
  city: { zone_name, color, price, sms, parking_limit, description },
  onSendSMS,
}) => {
  const { primary: colorOfZone, secondary: colorOfFill } = zoneColors[color];
  return (
    <View className="flex-col items-center px-4 mb-6">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View
            className={`w-[46px] h-[46px] rounded-lg border-4 border-${colorOfZone} justify-center items-center p-0.5 bg-${colorOfFill}`}
          >
            {/* Avatar or other image here */}
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text className="text-white font-psemibold text-sm">
              {zone_name} <Text className="text-red-500">{parking_limit}</Text>
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {sms}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        className={`w-full h-32 rounded-xl mt-3 relative justify-center items-center border border-${colorOfZone}`}
        activeOpacity={0.7}
        onPress={onSendSMS}
      >
        {/* Image and overlay */}
        {/* <View className="absolute w-full h-full bg-primary opacity-50 rounded-xl"></View> */}

        <View className="absolute justify-center items-center inset-0">
          <Text className="text-white text-3xl font-bold">{price} rsd</Text>
        </View>

        {/* <View className="absolute top-[-10] left-0 p-4">
          <Text className="text-gray-400 text-lg font-bold">{description}</Text>
        </View> */}
      </TouchableOpacity>
    </View>
  );
};

export default ZonesCard;
