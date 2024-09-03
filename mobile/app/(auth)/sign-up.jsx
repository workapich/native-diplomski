import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import { Link, router } from "expo-router";
import CustomButton from "../../components/CustomButton";
import axios from "axios";
const SignUp = () => {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [isSubmitting, setisSubmitting] = useState(false);

  const submit = async () => {
    setisSubmitting(true);

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/users/register`,
        {
          email: form.email,
          password: form.password,
          username: form.username,
        },
        config
      );

      // setUser({ ...data.data });
      Alert.alert("Almost there!", data.message, [{ text: "OK" }]);
      // router.replace("/home");
    } catch (error) {
      Alert.alert(
        "An Error Occured!",
        error?.response?.data?.message ?? error.message,
        [{ text: "OK" }]
      );
    }

    setisSubmitting(false);
    // try {
    //   // const result = await createUser();
    // } catch (error) {
    //   Alert.alert("Error", error.message);
    // } finally {
    //   setisSubmitting(false);
    // }
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          />
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
            Sign up to Aora
          </Text>
          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-10"
          />
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
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
              Already have an account?{" "}
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

export default SignUp;
