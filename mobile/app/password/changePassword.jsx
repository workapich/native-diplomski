import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import { Link, router } from "expo-router";
import CustomButton from "../../components/CustomButton";
import axios from "axios";

import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const ChangePassword = () => {
  const { user } = useContext(AuthContext); // Get the user (and token) from context

  const [form, setForm] = useState({
    oldPassword: "",
    username: "",
    reWriteNewPassword: "",
  });
  const [isSubmitting, setisSubmitting] = useState(false);

  const submit = async () => {
    setisSubmitting(true);

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      const { data } = await axios.put(
        `${process.env.EXPO_PUBLIC_API_URL}/users/changePass`,
        {
          oldPassword: form.oldPassword,
          newPassword: form.NewPassword,
          repeatNewPassword: form.reWriteNewPassword,
        },
        config
      );

      // setUser({ ...data.data });
      Alert.alert("Congrats!", data.message, [{ text: "OK" }]);
      // router.replace("/home");
    } catch (error) {
      Alert.alert(
        "An Error Occured!",
        error?.response?.data?.message ?? error.message,
        [{ text: "OK" }]
      );
    }

    setisSubmitting(false);
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
            Change Password
          </Text>
          <FormField
            title="Old Password"
            value={form.oldPassword}
            handleChangeText={(e) => setForm({ ...form, oldPassword: e })}
            otherStyles="mt-10"
          />
          <FormField
            title="New Password"
            value={form.NewPassword}
            handleChangeText={(e) => setForm({ ...form, NewPassword: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Repeat"
            value={form.reWriteNewPassword}
            handleChangeText={(e) =>
              setForm({ ...form, reWriteNewPassword: e })
            }
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign in"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row ga-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Changed your mind ?
            </Text>
            <Link
              href="sign-in"
              className="text-lg font-psemibold text-secondary"
            >
              Sign in
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePassword;
