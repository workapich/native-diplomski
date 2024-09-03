import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Image,
  Text,
  View,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import useMyAdmin from "../../lib/useMyAdmin";
import { specialCity, getActivePlate } from "../../lib/myAdmin";
import ZonesCard from "../../components/ZonesCard";
import * as SMS from "expo-sms";
import { icons } from "../../constants";
import Empty from "../../components/Empty";
import { useLocalSearchParams } from "expo-router";
import { usePathname, router } from "expo-router";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const Search = () => {
  const { user } = useContext(AuthContext);

  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useMyAdmin(() => specialCity(query));
  const { data: someActive } = useMyAdmin(getActivePlate);
  const [activeMessage, setActiveMessage] = useState(""); // Store the message here
  useEffect(() => {
    if (someActive && someActive.label) {
      // Adjust according to your data structure
      setActiveMessage(someActive.label);
    }
  }, [someActive]);

  useEffect(() => {
    refetch();
  }, [query]);

  const navigation = useNavigation();

  const sendSMS = useCallback(
    async (phoneNumber, idZone, idCity) => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const isSmsAvailable = await SMS.isAvailableAsync();
      if (!isSmsAvailable) {
        Alert.alert("Error", "SMS service is not available on this device.");
        return;
      }
      if (!phoneNumber) {
        Alert.alert("Error", "Phone number or message is missing.");
        return;
      }
      if (!activeMessage) {
        router.push(`/create`);
        Alert.alert("Error", "Set an active plate!");

        return;
      }

      const { result } = await SMS.sendSMSAsync(
        phoneNumber.toString(),
        activeMessage.toString()
      );
      // console.log("SMS Result:", idtwo);

      if (result === "sent") {
        // Alert.alert(
        //   `SMS city: ${idCity}`,
        //   `SMS sent successfully. zone: ${idZone}`
        // );

        try {
          // Replace `${process.env.EXPO_PUBLIC_API_URL}` with your actual API URL for testing
          const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URL}/history/addPayment`,
            {
              trimmedCity: idCity,
              trimmedZone: idZone,
            },
            config
          );

          Alert.alert("Payment successful!", response.data.message, [
            { text: "OK" },
          ]);
        } catch (error) {
          Alert.alert(
            "An Error Occurred!",
            error?.response?.data?.message ?? error.message,
            [{ text: "OK" }]
          );
        }
      }
    },
    [activeMessage]
  );

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          //treba da stoji item.sms
          <ZonesCard
            city={item}
            onSendSMS={() => sendSMS("+381603579213", item.id, item.city_id)}
          />
        )}
        ListHeaderComponent={() => (
          <View className="relative w-full h-40 rounded-xl mb-10 justify-center items-center">
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              className="absolute top-2 left-2 z-10"
            >
              <Image
                source={icons.leftArrow}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Image
              source={{
                uri: "http://172.20.10.4/elektronski_karton_za_ljubimce/uploads/belgrade.png",
              }}
              className="relative w-full h-full rounded-xl rounded-t-none bg-black-200 opacity-25"
              resizeMode="cover"
            />
            <View className="absolute ">
              <Text className="text-white text-3xl font-bold">
                {posts[0]?.name}
              </Text>
            </View>
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
