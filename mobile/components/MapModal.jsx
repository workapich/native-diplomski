import React from "react";
import { Modal, View, Text, TouchableOpacity, Alert } from "react-native";

// Define the MapModal component
const MapModal = ({ isVisible, onClose, feature, onSendSMS }) => {
  // Function to handle button clicks
  const handleButtonClick = (type) => {
    if (type === "hour") {
      Alert.alert("Hour Description", "This is the description for Hour.");
    } else if (type === "day") {
      Alert.alert("Day Description", "This is the description for Day.");
    }
    onClose();
  };
  return (
    <Modal transparent={true}>
      <View className="flex-1 items-center justify-center bg-gray-800/50">
        <View className="w-3/4 p-4 bg-white rounded-lg items-center">
          {feature && (
            <>
              <Text className="text-lg font-bold">{feature.name}</Text>
              <Text>{feature.description}</Text>
            </>
          )}
          <View className="flex-row w-full justify-between mt-4">
            <TouchableOpacity
              className="bg-gray-500 p-2 rounded-lg flex-1 mr-2"
              onPress={onClose}
            >
              <Text className="text-white text-center">Close</Text>
            </TouchableOpacity>
            {feature.hour !== "none" && (
              <TouchableOpacity
                className="bg-blue-500 p-2 rounded-lg flex-1 mx-2"
                onPress={() => onSendSMS(feature.hour.zone)}
              >
                <Text className="text-white text-center">Hour</Text>
              </TouchableOpacity>
            )}

            {feature.day !== "none" && (
              <TouchableOpacity
                className="bg-green-500 p-2 rounded-lg flex-1 ml-2"
                onPress={() => onSendSMS(feature.day.zone)}
              >
                <Text className="text-white text-center">Day</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MapModal;
