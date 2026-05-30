import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Edit src/app/index.tsx to edit this screen.</Text>
      <Link href="/acecelerometer">
        <Text style={{ color: "blue" }}>Go to acecelerometer</Text>
      </Link>
      <Link href="/gyroscope">
        <Text style={{ color: "blue" }}>Go to gyroscope</Text>
      </Link>
      <Link href="/light-sensor">
        <Text style={{ color: "blue" }}>Go to light-sensor</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
