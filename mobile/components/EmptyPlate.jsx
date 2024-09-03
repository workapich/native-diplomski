import React, { useState, useRef, useContext } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Modal,
  Button,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const EmptyPlate = ({ onAdd }) => {
  const { user } = useContext(AuthContext);
  const [plateValues, setPlateValues] = useState(["", "", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleConfirm = () => {
    Alert.alert("Confirm", `You entered: ${inputValue}`);
    setModalVisible(false);
  };

  const handleCancel = () => {
    setInputValue(null);
    Alert.alert("Canceled", "You canceled the input.");
    setModalVisible(false);
  };

  // Handle input change and focus on the next input
  const handleInputChange = (index, value) => {
    const newPlateValues = [...plateValues];
    newPlateValues[index] = value;

    // Move to the next input if it's not the last one
    if (index < plateValues.length - 1 && value.length === 1) {
      inputRefs.current[index + 1].focus();
    }

    setPlateValues(newPlateValues);
  };

  const handleSubmit = async () => {
    // Check if all fields are filled
    if (
      plateValues.every((value) => value.trim() !== "") ||
      inputValue.length > 5
    ) {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      // Concatenate plate values without spaces for submission
      const rawPlateValue = plateValues.join("");

      try {
        // Replace `${process.env.EXPO_PUBLIC_API_URL}` with your actual API URL for testing
        const response = await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/plates/addPlate`,
          {
            plate:
              inputValue.length > 5
                ? inputValue.toUpperCase()
                : rawPlateValue.toUpperCase(),
            type: inputValue.length > 5 ? "OTHER" : "STANDARD",
          },
          config
        );

        // console.log("Response data:", response.data); // Log response data for debugging
        Alert.alert("Plate entry successful!", response.data.message, [
          { text: "OK" },
        ]);
        onAdd();
      } catch (error) {
        Alert.alert(
          "An Error Occurred!",
          error?.response?.data?.message ?? error.message,
          [{ text: "OK" }]
        );
      }

      setPlateValues(["", "", "", "", "", "", ""]);
      setInputValue(null); // Reset all input values
      //   inputRefs.current[0].focus(); // Optionally, reset focus to the first input
    } else {
      Alert.alert(
        "Incomplete Input",
        "Please fill in all fields before submitting."
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className="flex-1 justify-center items-center p-4">
        <View className="justify-center items-center flex-row flex-1">
          {/* <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5"></View> */}
          <View className="justify-center flex-1 ml-3 gap-y-1">
            {/* <Text
                className="text-white font-psemibold text-sm"
                numberOfLines={1}
              >
                {label}
              </Text> */}
            <Text
              className="text-xs text-gray-100 font-pregular "
              numberOfLines={1}
            >
              Create a Standard Plate!
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text className="text-blue-500">
                Or Click Here For Other Types
              </Text>
            </TouchableOpacity>

            <Modal
              transparent={true}
              animationType="fade"
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                <View className="w-80 bg-white p-6 rounded-lg shadow-lg">
                  <Text className="text-lg font-bold mb-4">
                    Enter Your Plate
                  </Text>
                  <TextInput
                    className="border border-gray-300 p-2 mb-4"
                    placeholder="Type here..."
                    value={inputValue}
                    onChangeText={setInputValue}
                  />
                  <View className="flex-row justify-between">
                    <Button title="Cancel" onPress={handleCancel} />
                    <Button title="Confirm" onPress={handleSubmit} />
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </View>
        <TouchableOpacity
          className="relative w-full h-20 rounded-xl mt-3"
          onPress={() => inputRefs.current[0].focus()} // Focus first input when image is clicked
        >
          <Image
            source={{
              uri: "http://172.20.10.4/elektronski_karton_za_ljubimce/uploads/tablicaPrva.png",
            }}
            className="absolute w-full h-full rounded-xl"
            resizeMode="contain"
          />
          <View className="absolute inset-0 flex flex-row items-center justify-center">
            {plateValues.map((value, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                className={`w-7 h-10 top-5 border border-gray-400 bg-white text-center text-2xl ${
                  index === 0
                    ? "absolute left-12"
                    : index === 1
                    ? "absolute left-20"
                    : index === 2
                    ? "absolute left-40"
                    : index === 3
                    ? "absolute left-48"
                    : index === 4
                    ? "absolute left-56"
                    : index === 5
                    ? "absolute left-72"
                    : index === 6
                    ? "absolute left-80"
                    : ""
                }`}
                value={value}
                onChangeText={(text) => handleInputChange(index, text)}
                onSubmitEditing={handleSubmit} // Trigger handleSubmit when Enter is pressed
                maxLength={1} // Allow only one character per input
                keyboardType="default"
                autoCapitalize="characters"
              />
            ))}
          </View>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EmptyPlate;
