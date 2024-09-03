import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { icons } from "../constants"; // Adjust the path as needed

const PopupMenu = ({ visible, onClose, onRemove }) => {
  if (!visible) return null;

  return (
    <View className="absolute bottom-6 right-4 bg-white border opacity-80 border-red-300 shadow-lg rounded-lg p-2">
      <TouchableOpacity
        className="flex-row items-center p-2 w-28"
        onPress={onRemove}
      >
        <Image source={icons.eye} className="w-6 h-6 mr-2" />
        <Text className="text-red-500 font-bold">Remove</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity className="flex-row items-center p-2" onPress={onClose}>
        <Image source={icons.cancel} className="w-6 h-6 mr-2" />
        <Text className="text-gray-700">Cancel</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default PopupMenu;
