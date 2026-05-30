import useAccelerometer from "@/hooks/use-accelerometer";
import { StyleSheet, Text, View } from "react-native";

const accelerometer = () => {
  const { available, x, y, z } = useAccelerometer();
  return (
    <View>
      <Text>Available: {available.toString()}</Text>
      <Text>X: {x.toFixed(2)}</Text>
      <Text>Y: {y.toFixed(2)}</Text>
      <Text>Z: {z.toFixed(2)}</Text>
    </View>
  );
};

export default accelerometer;

const styles = StyleSheet.create({});
