import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import { router } from "expo-router";
const CityCard = ({ city: { name, id, image, available, colors } }) => {
  const [play, setPlay] = useState(false);
  const color = colors.split(",");
  const colorArray = colors.split(",").map((color) => color.trim());
  const stripeWidth = `${100 / colorArray.length}%`;
  // console.log(colorArray);
  // console.log(color);
  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[36px] h-[26px] rounded-lg  justify-center items-center p-0.5 overflow-hidden">
            <View className="w-full h-full flex-row">
              {colorArray.length > 0 ? (
                colorArray.map((color, index) => (
                  <View
                    key={index}
                    style={{
                      width: stripeWidth,
                      backgroundColor: color.toLowerCase(),
                      transform: [{ skewY: "-45deg" }],
                    }}
                  ></View>
                ))
              ) : (
                <Text>No color</Text>
              )}
            </View>
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {name}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular "
              numberOfLines={1}
            >
              {color}
            </Text>
          </View>
        </View>
      </View>
      {play ? (
        <Text>Playing</Text>
      ) : (
        <TouchableOpacity
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center "
          activeOpacity={0.7}
          onPress={() => {
            router.push(`/city/${id}`);
          }}
        >
          {/* Image */}
          <Image
            source={{
              uri: "http://172.20.10.4/elektronski_karton_za_ljubimce/uploads/belgrade.png",
            }}
            className="absolute w-full h-full rounded-xl "
            resizeMode="cover"
          />

          {/* Overlay with a semi-transparent red color */}
          <View className="absolute w-full h-full bg-primary opacity-50 rounded-xl"></View>

          {/* Centered Text */}
          <View className="absolute justify-center items-center inset-0">
            <Text className="text-white text-3xl font-bold">{name}</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CityCard;
