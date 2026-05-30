import useAccelerometer from "@/hooks/use-accelerometer";
import { useEffect } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const VIAL_SIZE = width * 0.72;
const BUBBLE_SIZE = 44;
const MAX_OFFSET = VIAL_SIZE / 2 - BUBBLE_SIZE / 2 - 8;
const LEVEL_THRESHOLD = 1.5;

function clamp(val: number, min: number, max: number) {
  "worklet";
  return Math.min(Math.max(val, min), max);
}

function toDeg(accel: number, gravity: number) {
  "worklet";
  return (Math.atan2(accel, Math.abs(gravity)) * 180) / Math.PI;
}

export default function SpiritLevel() {
  const { available, x, y, z } = useAccelerometer();

  const tx = toDeg(x, z);
  const ty = toDeg(y, z);
  const total = Math.sqrt(tx * tx + ty * ty);
  const isLevel = total < LEVEL_THRESHOLD;

  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  const targetX = clamp((tx / 45) * MAX_OFFSET, -MAX_OFFSET, MAX_OFFSET);
  const targetY = clamp((ty / 45) * MAX_OFFSET, -MAX_OFFSET, MAX_OFFSET);

  useEffect(() => {
    offsetX.value = withSpring(targetX, { damping: 18, stiffness: 180 });
    offsetY.value = withSpring(targetY, { damping: 18, stiffness: 180 });
  }, [targetX, targetY]);

  const bubbleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offsetX.value }, { translateY: offsetY.value }],
    borderColor: isLevel ? "rgba(74,222,128,0.6)" : "rgba(248,113,113,0.6)",
    backgroundColor: isLevel
      ? "rgba(74,222,128,0.12)"
      : "rgba(248,113,113,0.12)",
    shadowColor: isLevel ? "#4ade80" : "#f87171",
  }));

  return (
    <View style={styles.container}>
      {/* Card */}
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.titleRow}>
          <View style={styles.iconBox}>
            <Text style={styles.iconText}>⊟</Text>
          </View>
          <Text style={styles.title}>spirit level</Text>
        </View>

        {/* Vial */}
        <View style={styles.vialWrapper}>
          <View style={styles.vial}>
            {/* Crosshairs */}
            <View style={styles.crossH} />
            <View style={styles.crossV} />
            {/* Target rings */}
            <View style={styles.targetOuter} />
            <View style={styles.targetInner} />
            {/* Bubble */}
            <Animated.View style={[styles.bubble, bubbleStyle]} />
          </View>
        </View>

        {/* Status badge */}
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.badge,
              isLevel ? styles.badgeLevel : styles.badgeOff,
            ]}
          >
            <View
              style={[styles.dot, isLevel ? styles.dotLevel : styles.dotOff]}
            />
            <Text
              style={[
                styles.badgeText,
                isLevel ? styles.badgeTextLevel : styles.badgeTextOff,
              ]}
            >
              {isLevel ? "LEVEL" : "NOT LEVEL"}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Axis readings */}
        <View style={styles.axisRow}>
          <View style={styles.axisCard}>
            <Text style={styles.axisLabel}>X TILT</Text>
            <Text style={styles.axisValue}>
              {tx.toFixed(1)}
              <Text style={styles.axisUnit}>°</Text>
            </Text>
          </View>
          <View style={styles.axisCard}>
            <Text style={styles.axisLabel}>Y TILT</Text>
            <Text style={styles.axisValue}>
              {ty.toFixed(1)}
              <Text style={styles.axisUnit}>°</Text>
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.hint}>tilt your device</Text>
          <Text style={styles.totalText}>±{total.toFixed(1)}°</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080808",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#0f0f0f",
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: "#2a2a2a",
    padding: 24,
    width: "100%",
    maxWidth: 380,
  },

  // Header
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 7,
    backgroundColor: "#1a1a1a",
    borderWidth: 0.5,
    borderColor: "#2a2a2a",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    color: "#555",
    fontSize: 16,
  },
  title: {
    fontSize: 13,
    fontWeight: "500",
    color: "#888",
    letterSpacing: 0.6,
  },

  // Vial
  vialWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  vial: {
    width: VIAL_SIZE,
    height: VIAL_SIZE,
    borderRadius: VIAL_SIZE / 2,
    backgroundColor: "#141414",
    borderWidth: 1.5,
    borderColor: "#2c2c2c",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  crossH: {
    position: "absolute",
    left: "10%",
    right: "10%",
    height: 0.5,
    backgroundColor: "#2a2a2a",
  },
  crossV: {
    position: "absolute",
    top: "10%",
    bottom: "10%",
    width: 0.5,
    backgroundColor: "#2a2a2a",
  },
  targetOuter: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#333",
  },
  targetInner: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: "#3a3a3a",
  },
  bubble: {
    position: "absolute",
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },

  // Status
  badgeRow: {
    alignItems: "center",
    marginBottom: 20,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 0.5,
  },
  badgeLevel: {
    borderColor: "rgba(74,222,128,0.3)",
    backgroundColor: "rgba(74,222,128,0.05)",
  },
  badgeOff: {
    borderColor: "rgba(248,113,113,0.3)",
    backgroundColor: "rgba(248,113,113,0.05)",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotLevel: { backgroundColor: "#4ade80" },
  dotOff: { backgroundColor: "#f87171" },
  badgeText: {
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.8,
  },
  badgeTextLevel: { color: "#4ade80" },
  badgeTextOff: { color: "#f87171" },

  // Divider
  divider: {
    height: 0.5,
    backgroundColor: "#1f1f1f",
    marginBottom: 16,
  },

  // Axis cards
  axisRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  axisCard: {
    flex: 1,
    backgroundColor: "#171717",
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#222",
    padding: 14,
  },
  axisLabel: {
    fontSize: 10,
    letterSpacing: 0.9,
    color: "#555",
    marginBottom: 4,
  },
  axisValue: {
    fontSize: 22,
    fontWeight: "500",
    color: "#e8e8e8",
  },
  axisUnit: {
    fontSize: 13,
    color: "#666",
  },

  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hint: {
    fontSize: 11,
    color: "#3a3a3a",
  },
  totalText: {
    fontSize: 12,
    color: "#444",
    fontVariant: ["tabular-nums"],
  },
});
