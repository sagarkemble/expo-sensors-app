import useLightSensor from "@/hooks/use-lightsensor";
import { StyleSheet, Text, View } from "react-native";

const lightSensor = () => {
  const { available, illuminance } = useLightSensor();
  return (
    <View>
      <Text>Light Sensor: {illuminance.toFixed(2)}</Text>
    </View>
  );
};

export default lightSensor;

const styles = StyleSheet.create({});
