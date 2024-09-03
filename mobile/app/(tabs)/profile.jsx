import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  Image,
  Text,
  View,
  FlatList,
  SafeAreaView,
  Alert,
  Button,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { images } from "../../constants";
import Empty from "../../components/Empty";
import useMyAdmin from "../../lib/useMyAdmin";
import {
  getAllPlates,
  getActivePlate,
  getLatestPayments,
} from "../../lib/myAdmin";
import PlateCard from "../../components/PlateCard";
import EmptyPlate from "../../components/EmptyPlate";
import HistoryCard from "../../components/HistoryCard";
const Profile = () => {
  const { logout } = useContext(AuthContext);
  const { data: latestPayments, refetch: refetchPayment } =
    useMyAdmin(getLatestPayments);
  const { data: someActive } = useMyAdmin(getActivePlate); // Fetch active plate data
  const [activeId, setActiveId] = useState(null); // Start with null or some default value
  useEffect(() => {
    if (someActive && someActive.id) {
      setActiveId(someActive.id);
    }
    // console.log(someActive);
  }, [someActive]); // Update activeId only when someActive is available

  const { data: posts, refetch } = useMyAdmin(getAllPlates); // Fetch all plates
  const [currentMenuId, setCurrentMenuId] = useState(null);

  // Callback function to handle plate deletion
  const handlePlateDeletion = useCallback(() => {
    refetch(); // Re-fetch the plates
  }, [refetch]);

  const handlePressOutside = useCallback(() => {
    setCurrentMenuId(null);
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={latestPayments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HistoryCard
            city={item}
            activeId={activeId} // Pass the updated activeId
            setActiveId={setActiveId}
            isMenuVisible={currentMenuId === item.id}
            setMenuVisible={(id) => setCurrentMenuId(id)}
            onDelete={handlePlateDeletion} // Pass the deletion callback
          />
        )}
        ListHeaderComponent={() => (
          <View>
            <View className="my-6 px-4 space-y-6">
              <View className="justify-between items-start flex-row mb-6">
                <View>
                  <Text className="font-pmedium text-sm text-gray-100">
                    Your plates
                  </Text>
                  <Text className="text-2xl font-psemibold text-white">
                    Choose wisely!
                  </Text>
                </View>

                <View className="mt-1.5">
                  <Text className="text-2xl font-psemibold text-white">
                    VP-Logo
                  </Text>
                  {/* <Image
                    source={images.logoSmall}
                    className="w-9 h-10"
                    resizeMode="contain"
                  /> */}
                </View>
              </View>
            </View>
          </View>
        )}
      />

      <Button title="Logout" onPress={logout} />
    </SafeAreaView>
  );
};

export default Profile;
