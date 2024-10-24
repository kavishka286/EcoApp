import { View, Text, Button, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default function secondScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF" }}>
      
      {/* Top half with the Image */}
      <View style={{ flex: 0.6, justifyContent: "flex-end" }}>
        <Image
          source={require('../../assets/images/splash2.jpg')} // updated to use the image you uploaded
          style={{ width: 300, height: 350, borderRadius: 10 }} // Adjusted size and shape
        />
      </View>
      
      {/* Welcome Text */}
      <View style={{ flex: 0.2, justifyContent: "center", alignItems: "center", marginTop: 20 }}>
        <Text style={{ fontSize: 25, fontWeight: "bold", color: "#000000", fontFamily: "roboto-bold" }}>
        We provide high 
        <Text style={{color: "#3EB049"}}> quality plants </Text> 
        </Text>
        <Text style={{ fontSize: 25, fontWeight: "bold", color: "#000000", fontFamily: "roboto-bold" }}>
        just for you
        </Text>
      </View>
      
      {/* Pagination Dots */}
      <View style={{ flex: 0.1, flexDirection: "row", marginTop: 10 }}>
        <View style={{
          width: 8, height: 8, backgroundColor: "#A0A0A0", borderRadius: 4, marginHorizontal: 2
        }} />
        <View style={{
          width: 25, height: 8, backgroundColor: "#3EB049", borderRadius: 4, marginHorizontal: 2
        }} />
        <View style={{
          width: 8, height: 8, backgroundColor: "#A0A0A0", borderRadius: 4, marginHorizontal: 2
        }} />
      </View>

      {/* Bottom Button */}
      <View style={{ flex: 0.2, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#3EB049",
            paddingVertical: 8,
            paddingHorizontal: 20,
            borderRadius: 30
          }}
          onPress={() => router.push("thirdScreen")}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 18, fontFamily: "roboto-bold" }}>Next</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}
