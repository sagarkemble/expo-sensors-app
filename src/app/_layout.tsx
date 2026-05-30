import { Tabs } from "expo-router";
import { Move3D, Orbit, Sun } from "lucide-react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#080808" }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "#ededed",
            tabBarInactiveTintColor: "#666",
            tabBarStyle: {
              backgroundColor: "#080808",
              borderTopWidth: 0.5,
              borderTopColor: "#222",
              paddingTop: 5,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: "500",
            },
          }}
        >
          <Tabs.Screen
            name="gyroscope"
            options={{
              title: "Gyroscope",
              tabBarIcon: ({ color, size, focused }) => (
                <Orbit
                  size={focused ? size + 2 : size}
                  color={color}
                  strokeWidth={focused ? 2 : 2}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="accelerometer"
            options={{
              title: "Accelerometer",
              tabBarIcon: ({ color, size, focused }) => (
                <Move3D
                  size={focused ? size + 2 : size}
                  color={color}
                  strokeWidth={focused ? 2 : 2}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="light-sensor"
            options={{
              title: "Light Sensor",
              tabBarIcon: ({ color, size, focused }) => (
                <Sun
                  size={focused ? size + 2 : size}
                  color={color}
                  strokeWidth={focused ? 2 : 2}
                />
              ),
            }}
          />
        </Tabs>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
