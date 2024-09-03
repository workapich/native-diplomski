import { View, Text, Image } from "react-native";
import React from "react";
import { router } from "expo-router";
import { images } from "../constants";
import CustomButton from "./CustomButton";
const FindCard = ({ title, subtitle }) => {
  return (
    <View className="justify-center items-center px-4 border-4 border-secondary-100 bg-secondary-100/20 pb-10 mt-10  rounded-xl">
      <Image
        source={images.findme}
        className="w-[150px] h-[150px] my-10"
        resizeMode="contain"
      />

      <Text className="text-xl text-center font-psemibold text-white mt-2">
        {title}
      </Text>
      <Text className="font-pmedium text-sm text-gray-100">{subtitle}</Text>
      {/* <CustomButton
        title="Create video"
        handlePress={() => router.push("/create")}
        containerStyles="w-full my-5"
      /> */}
    </View>
  );
};

export default FindCard;
