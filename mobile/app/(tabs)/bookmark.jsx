import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from "react";
import {
  View,
  Alert,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from "react-native";
import MapView, { Polygon, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { isPointInPolygon } from "geolib";
import MapModal from "../../components/MapModal";
import * as SMS from "expo-sms";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { router } from "expo-router";
const customMapGeoJSON = require("../../assets/mapGeo.json");

const data = [
  { id: "1", name: "Subotica", coords: [46.1002131, 19.6656214] },
  { id: "2", name: "Vrbas", coords: [45.572154, 19.646008] },
  { id: "3", name: "Sombor", coords: [45.773037, 19.109235] },
  { id: "4", name: "Kula", coords: [45.605421, 19.530066] },
  { id: "10", name: "Sivac", coords: [45.7019983, 19.3709357] },
];

const Bookmark = () => {
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
        } catch (error) {
          Alert.alert(
            "An Error Occurred!",
            error?.response?.data?.message ?? error.message,
            [{ text: "OK" }]
          );
        } finally {
          setSelectedFeature(null);
        }
      }
    },
    [user.activePlate]
  );

  const [region, setRegion] = useState({
    latitude: 46.0997663,
    longitude: 19.6564649,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [marker, setMarker] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }
    };
    requestPermissions();
  }, []);

  const jumpToCity = (latitude, longitude) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...region,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        300
      );

      setTimeout(() => {
        mapRef.current.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
          1000
        );
      }, 300);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      className="w-20 h-20 bg-blue-500 border-2 border-blue-700 rounded-full justify-center items-center opacity-50"
      onPress={() => jumpToCity(...item.coords)}
      cl
    >
      <Text className="text-white font-bold">{item.name}</Text>
    </TouchableOpacity>
  );

  const handleAddMarker = async () => {
    setLoading(true);
    try {
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      setMarker({ latitude, longitude });
      setRegion({
        ...region,
        latitude,
        longitude,
      });
      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        1000
      );

      let isInZone = false;
      let zoneName = "Sorry, you are not in any zone";

      customMapGeoJSON.features.forEach((feature) => {
        const { coordinates } = feature.geometry;
        const polygon = coordinates[0].map((coord) => ({
          latitude: coord[1],
          longitude: coord[0],
        }));

        if (isPointInPolygon({ latitude, longitude }, polygon)) {
          isInZone = true;
          name = feature.properties.name.trim();
          description = feature.properties.description.trim();
          hour = feature.properties.hour[0];

          day = feature.properties.day[0];
          city_id = feature.properties.city_id.trim();
          handlePolygonPress({ name, description, hour, day, city_id });
        }
      });
      if (!isInZone) Alert.alert("Sorry, you are not in any zone");
    } catch (error) {
      Alert.alert("Error", "Unable to get location. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePolygonPress = (properties) => {
    setSelectedFeature(properties);
    console.log(properties);
  };

  const renderPolygons = () => {
    return customMapGeoJSON.features.map((feature, index) => {
      const { coordinates } = feature.geometry;
      const { name, description, fill, stroke, strokeWidth, fillOpacity } =
        feature.properties;
      return (
        <Polygon
          key={index}
          coordinates={coordinates[0].map((coord) => ({
            latitude: coord[1],
            longitude: coord[0],
          }))}
          fillColor={`rgba(217, 72, 72,0.5)`}
          strokeColor={`rgba(217, 72, 72,0.5)`}
          strokeWidth={2}
          onPress={() =>
            handlePolygonPress({
              name,
              description,
              name,
              description,
              hour,
              day,
              city_id,
            })
          }
        />
      );
    });
  };

  const handleCloseModal = () => {
    setSelectedFeature(null);
  };

  return (
    <View className="flex-1 relative">
      <MapView
        ref={mapRef}
        className="flex-1"
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {renderPolygons()}
        {marker && <Marker coordinate={marker} title="Your Location" />}
      </MapView>

      <View className="absolute top-28 right-2 flex flex-column justify-center ">
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }} // gap between items
          style={{ maxHeight: 5 * 80 + 4 * 8 }} // 5 items + 4 gaps
        />
      </View>
      <View className="absolute bottom-4 left-0 right-0 flex flex-row justify-center ">
        {/* <TouchableOpacity
          className="w-20 h-20 bg-blue-500 border-2 border-blue-700 rounded-full justify-center items-center opacity-50"
          onPress={() => jumpToCity(46.1002131, 19.6656214)}
        >
          <Text className="text-white font-bold">Subotica</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          className="w-20 h-20 bg-primary  border-2 border-white rounded-full justify-center items-center opacity-50"
          onPress={handleAddMarker}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#ff0000" />
          ) : (
            <Text className="text-white font-bold">Find me</Text>
          )}
        </TouchableOpacity>
        {/* 
        <TouchableOpacity
          className="w-20 h-20 bg-green-500 border-2 border-green-700 rounded-full justify-center items-center opacity-50"
          onPress={() => jumpToCity(45.7019983, 19.3709357)}
        >
          <Text className="text-white font-bold">Sivac</Text>
        </TouchableOpacity> */}
      </View>

      {selectedFeature && (
        <MapModal
          onClose={handleCloseModal}
          feature={selectedFeature}
          onSendSMS={(zone_id) =>
            sendSMS("+381603579213", zone_id, selectedFeature.city_id)
          }
        />
      )}
    </View>
  );
};

export default Bookmark;
