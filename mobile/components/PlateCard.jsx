import React, { useState, useRef, useContext, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import { icons } from "../constants";
import PopupMenu from "./PopupMenu";
import { AuthContext } from "../context/AuthContext";
import { deletePlate, updateActive } from "../lib/myAdmin";
import * as SecureStore from "expo-secure-store";
const PlateCard = ({
  city: { id, label, plate_type },
  activeId,
  setActiveId,
  setMenuVisible,
  isMenuVisible,
  onDelete,
}) => {
  const { user, setUser } = useContext(AuthContext);
  const menuRef = useRef(null);
  const labels = [label.slice(0, 2), label.slice(2, 5), label.slice(5, 7)];
  const [deleting, setDeleting] = useState(null);
  const [updatingActive, setUpdatingActive] = useState(null);

  const handleDelete = async () => {
    try {
      if (user.token) {
        await deletePlate(user.token, id);
        Alert.alert("Notification", `Plate ${label} deleted successfully.`);

        if (label === user.activePlate) {
          const updatedUser = {
            ...user,
            activePlate: null,
          };

          setUser(updatedUser);

          // Update SecureStore with the new user data
          await SecureStore.setItemAsync(
            "userData",
            JSON.stringify(updatedUser)
          );
        }

        onDelete(); // Trigger the callback to re-fetch data in Create
      } else {
        Alert.alert("Error", "No authentication token found.");
      }
    } catch (error) {
      console.error("Error deleting plate:", error);
      Alert.alert("Error", "Failed to delete plate.");
    } finally {
      setDeleting(null);
    }
  };

  const handleUpdateActive = async () => {
    if (updatingActive !== activeId) {
      try {
        if (user.token) {
          await updateActive(user.token, id, label);
          setActiveId(id);
          const updatedUser = {
            ...user,
            activePlate: label,
          };

          setUser(updatedUser);

          // Update SecureStore with the new user data
          await SecureStore.setItemAsync(
            "userData",
            JSON.stringify(updatedUser)
          );

          Alert.alert("Notification", `Active Plate set successfully.`);
        } else {
          Alert.alert("Error", "No authentication token found.");
        }
      } catch (error) {
        Alert.alert("Error", `Failed to activate plate ${id}.`);
      }
    }
    setUpdatingActive(null);
  };

  useEffect(() => {
    if (deleting !== null) {
      handleDelete();
    }
  }, [deleting]);

  useEffect(() => {
    if (updatingActive !== null) {
      handleUpdateActive();
      console.log(user.activePlate);
    }
  }, [updatingActive]);

  const showMenu = () => setMenuVisible(id);
  const hideMenu = () => setMenuVisible(false);

  const onRemove = () => {
    setDeleting(id);
    hideMenu();
  };

  return (
    <TouchableWithoutFeedback onPress={() => setMenuVisible(null)}>
      <View className="flex-col items-center px-4 mb-4">
        <View className="flex-row gap-3 items-start">
          <View className="justify-center items-center flex-row flex-1">
            <View className="justify-center flex-1 ml-3 gap-y-1">
              <Text
                className="text-xs text-gray-100 font-pregular "
                numberOfLines={1}
              >
                {plate_type}
              </Text>
            </View>
          </View>

          <View className="pt-2" ref={menuRef}>
            <TouchableOpacity onPress={showMenu}>
              <Image
                source={icons.menu}
                className="w-5 h-5"
                resizeMode="contain"
              />
            </TouchableOpacity>
            {isMenuVisible && (
              <PopupMenu
                visible={isMenuVisible}
                onClose={hideMenu}
                onRemove={onRemove}
              />
            )}
          </View>
        </View>

        <TouchableOpacity
          className={`w-full h-20 rounded-xl mt-3 relative justify-center items-center `}
          activeOpacity={0.7}
          onPress={() => {
            setUpdatingActive(id);
          }}
        >
          <Image
            source={{
              uri:
                plate_type === "STANDARD"
                  ? "http://172.20.10.4/elektronski_karton_za_ljubimce/uploads/tablica_za_kola.jpg"
                  : "http://172.20.10.4/elektronski_karton_za_ljubimce/uploads/no_tablica.jpg",
            }}
            className={`absolute ${
              activeId === id
                ? "border-4 border-white"
                : "border-0 border-transparent"
            }  w-full h-full rounded-xl`}
            resizeMode="contain"
          />
          <View className="absolute w-full h-full flex items-center justify-center top-1">
            {plate_type === "STANDARD" ? (
              <>
                <Text
                  allowFontScaling={false}
                  className="left-10 absolute text-black-200 text-6xl font-bold pt-1.5"
                >
                  {labels[0]}
                </Text>
                <Text className="absolute text-black-200 text-6xl right-32 font-bold pt-1.5">
                  {labels[1]}
                </Text>
                <Text className="absolute text-black-200 text-6xl right-4 font-bold pt-1.5">
                  {labels[2]}
                </Text>
              </>
            ) : (
              <Text
                allowFontScaling={false}
                className=" text-black-200 text-5xl font-bold pt-1.5 ml-3"
              >
                {label}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default PlateCard;
