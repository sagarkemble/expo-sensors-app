import useGyroscope from "@/hooks/use-gyroscope";
import { StyleSheet, Text, View } from "react-native";

const gyroscope = () => {
  const { available, x, y, z } = useGyroscope();
  return (
    <View>
      <Text>
        Gyroscope: {x.toFixed(2)}, {y.toFixed(2)}, {z.toFixed(2)}
      </Text>
    </View>
  );
};

export default gyroscope;

const styles = StyleSheet.create({});
