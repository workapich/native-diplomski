import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import React, { useState, useCallback, useContext, useEffect } from "react";
import * as Animatable from "react-native-animatable";
import { zoneColors } from "../constants/colors";
import * as SMS from "expo-sms";
import { getActivePlate } from "../lib/myAdmin";
import useMyAdmin from "../lib/useMyAdmin";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { usePathname, router } from "expo-router";

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1,
  },
};
const zoomOut = {
  1: {
    scale: 0.9,
  },
  0: {
    scale: 1,
  },
};

const TrendingItem = ({ activeItem, item, onSendSMS }) => {
  const { primary: colorOfZone, secondary: colorOfFill } =
    zoneColors[item.color];

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.id ? zoomIn : zoomOut}
      duration={500}
    >
      <TouchableOpacity
        className="relative justify-center items-center"
        activeOpacity={0.7}
        onPress={onSendSMS}
      >
        <ImageBackground
          source={{
            // uri:item.thumbnail
            uri: "http://172.20.10.4/elektronski_karton_za_ljubimce/uploads/belgrade.png",
          }}
          className={`w-52 h-72 rounded-[35px] my-5 overflow-hidden border-4 border-${colorOfZone} shadow-lg shadow-black/40`}
          resizeMode="cover"
        />
        <View
          className={`absolute w-52 h-72 rounded-[35px] my-5 bg-primary opacity-30 border-6 border-red-700`}
        ></View>
        {/* Centered Text */}
        <View className="absolute justify-center items-center inset-0">
          <Text className="text-white text-xl font-bold">{item.city_name}</Text>
          <Text className="text-white text-base font-bold">
            {item.zone_name}
          </Text>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
};
const Trending = ({ posts, onRefresh }) => {
  const { user } = useContext(AuthContext);

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
      if (!user.activePlate) {
        router.push(`/create`);
        Alert.alert("Error", "Set an active plate!");

        return;
      }

      const { result } = await SMS.sendSMSAsync(
        phoneNumber.toString(),
        user.activePlate.toString()
      );
      // console.log("SMS Result:", idtwo);

      if (result === "sent") {
        console.log(user);

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

          onRefresh();
        } catch (error) {
          Alert.alert(
            "An Error Occurred!",
            error?.response?.data?.message ?? error.message,
            [{ text: "OK" }]
          );
        }
      }
    },
    [user.activePlate]
  );

  const [activeItem, setActiveItem] = useState(posts[1]);

  const viewableItemsChanges = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TrendingItem
          activeItem={activeItem}
          item={item}
          onSendSMS={() => sendSMS("+381603579213", item.id_zone, item.id_city)}
        />
      )}
      onViewableItemsChanged={viewableItemsChanges}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 170 }}
      horizontal
    />
  );
};

export default Trending;
