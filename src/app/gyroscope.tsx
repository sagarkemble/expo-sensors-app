import useGyroscope from "@/hooks/use-gyroscope";
import { FontAwesome5 } from "@expo/vector-icons";
import { Building2, Globe, MapPin } from "lucide-react-native";
import { useEffect, useRef } from "react";
import {
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const CARD_W = width * 0.82;
const MAX_TILT = 22;
const SPRING = { damping: 16, stiffness: 110, mass: 0.9 };
const PAD = 22;

const USER = {
  name: "Sagar Kemble",
  username: "@sagarkemble",
  role: "Full Stack Developer",
  bio: "I create & develop modern frontend websites. Currently exploring full-stack development and mobile development with the chai code.",
  company: "Sanpurnam Infotech",
  location: "Sangli, Maharashtra",
  website: "sagarkemble.dev",
  avatar: "https://avatars.githubusercontent.com/u/131292159?v=4",
  id: "GH-131292159",
  socials: {
    github: "https://github.com/sagarkemble",
    twitter: "https://x.com/home",
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/feed/",
  },
};

function clamp(v: number, lo: number, hi: number) {
  "worklet";
  return Math.min(Math.max(v, lo), hi);
}

export default function GitHubBadge() {
  const { x, y, z } = useGyroscope();
  const rotX = useSharedValue(0);
  const rotY = useSharedValue(0);
  const lastTs = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    const dt = Math.min((now - lastTs.current) / 1000, 0.05);
    lastTs.current = now;
    const DECAY = 0.95;
    rotX.value = withSpring(
      clamp(rotX.value * DECAY + y * dt * 55, -MAX_TILT, MAX_TILT),
      SPRING,
    );
    rotY.value = withSpring(
      clamp(rotY.value * DECAY - x * dt * 55, -MAX_TILT, MAX_TILT),
      SPRING,
    );
  }, [x, y, z]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 900 },
      { rotateX: `${rotX.value}deg` },
      { rotateY: `${rotY.value}deg` },
    ],
  }));

  const shimmerStyle = useAnimatedStyle(() => {
    const tx = interpolate(
      rotY.value,
      [-MAX_TILT, MAX_TILT],
      [-CARD_W * 0.5, CARD_W * 0.5],
    );
    const ty = interpolate(
      rotX.value,
      [-MAX_TILT, MAX_TILT],
      [-CARD_W * 0.4, CARD_W * 0.4],
    );
    const opacity = interpolate(
      Math.abs(rotX.value) + Math.abs(rotY.value),
      [0, MAX_TILT * 1.5],
      [0.0, 0.12],
    );
    return { transform: [{ translateX: tx }, { translateY: ty }], opacity };
  });

  const shadowStyle = useAnimatedStyle(() => {
    const d = (Math.abs(rotX.value) + Math.abs(rotY.value)) / (MAX_TILT * 2);
    return {
      shadowRadius: interpolate(d, [0, 1], [10, 32]),
      shadowOpacity: interpolate(d, [0, 1], [0.25, 0.6]),
      shadowOffset: {
        width: interpolate(rotY.value, [-MAX_TILT, MAX_TILT], [10, -10]),
        height: interpolate(rotX.value, [-MAX_TILT, MAX_TILT], [-8, 8]),
      },
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.shadowWrap, shadowStyle]}>
        {/* Card is intrinsic height — wraps content exactly */}
        <Animated.View style={[styles.card, cardStyle]}>
          <Animated.View
            style={[styles.shimmer, shimmerStyle]}
            pointerEvents="none"
          />

          {/* Top accent */}
          <View style={styles.accentBar} />

          {/* ── Body: padding only, no flex ── */}
          <View style={styles.body}>
            {/* Avatar */}
            <View style={styles.avatarWrap}>
              <Image source={{ uri: USER.avatar }} style={styles.avatar} />
            </View>

            {/* Name + role */}
            <Text style={styles.name}>{USER.name}</Text>
            <Text style={styles.role}>{USER.role}</Text>

            {/* Bio */}
            <Text style={styles.bio}>{USER.bio}</Text>

            <View style={styles.divider} />

            {/* Info rows */}
            <View style={styles.infoBlock}>
              <Row
                icon={<Building2 size={13} color="#999" strokeWidth={1.5} />}
                text={USER.company}
              />
              <Row
                icon={<MapPin size={13} color="#999" strokeWidth={1.5} />}
                text={USER.location}
              />
              <Row
                icon={<Globe size={13} color="#999" strokeWidth={1.5} />}
                text={USER.website}
                onPress={() => Linking.openURL(`https://${USER.website}`)}
              />
            </View>

            <View style={styles.divider} />

            {/* ID */}
            <View style={styles.idRow}>
              <Text style={styles.idLabel}>SYSTEM ID</Text>
              <Text style={styles.idValue}>{USER.id}</Text>
            </View>

            {/* Barcode */}
            <View style={styles.barcode}>
              {Array.from({ length: 30 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.bar,
                    {
                      width: [
                        1, 2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 2, 1, 1, 2, 3, 1, 1, 2,
                        1, 3, 1, 2, 1, 1, 2, 1, 2, 1, 3,
                      ][i],
                      opacity: [
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                        0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                      ][i],
                    },
                  ]}
                />
              ))}
            </View>

            {/* Bottom row */}
            <View style={styles.bottomRow}>
              <Text style={styles.username}>{USER.username}</Text>
              <View style={styles.socialsRow}>
                {[
                  { n: "github", url: USER.socials.github },
                  { n: "twitter", url: USER.socials.twitter },
                  { n: "instagram", url: USER.socials.instagram },
                  { n: "linkedin-in", url: USER.socials.linkedin },
                ].map((s) => (
                  <TouchableOpacity
                    key={s.n}
                    onPress={() => Linking.openURL(s.url)}
                    activeOpacity={0.7}
                    style={styles.socialBtn}
                  >
                    <FontAwesome5 name={s.n} size={15} color="#888" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Animated.View>
      </Animated.View>

      <Text style={styles.hint}>tilt your device</Text>
    </View>
  );
}

function Row({
  icon,
  text,
  onPress,
}: {
  icon: React.ReactNode;
  text: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <View style={styles.rowIconWrap}>{icon}</View>
      <Text style={[styles.rowText, onPress && styles.rowLink]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080808",
    alignItems: "center",
    justifyContent: "center",
  },

  shadowWrap: {
    borderRadius: 22,
    shadowColor: "#a0a0ff",
    zIndex: 10,
  },

  // Card has NO fixed height — it wraps its content
  card: {
    width: CARD_W,
    borderRadius: 22,
    backgroundColor: "#0f0f0f",
    borderWidth: 0.5,
    borderColor: "#2c2c2c",
    overflow: "hidden",
  },

  shimmer: {
    position: "absolute",
    width: CARD_W * 3,
    height: CARD_W * 4,
    borderRadius: CARD_W * 1.5,
    backgroundColor: "#fff",
    top: -CARD_W,
    left: -CARD_W,
    zIndex: 20,
    pointerEvents: "none",
  },

  accentBar: {
    height: 4,
    backgroundColor: "#e8e8e8",
    opacity: 0.06,
  },

  // ── No flex:1, no marginTop:auto — pure padding layout ──
  body: {
    padding: PAD,
    alignItems: "center",
  },

  // Avatar
  avatarWrap: {
    borderRadius: 60,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    padding: 3,
    marginBottom: 14,
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
  },

  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ededed",
    letterSpacing: 0.2,
    marginBottom: 5,
    textAlign: "center",
  },
  role: {
    fontSize: 12,
    color: "#999",
    letterSpacing: 0.8,
    textAlign: "center",
    marginBottom: 10,
  },

  bio: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    lineHeight: 18,
    letterSpacing: 0.1,
  },

  divider: {
    height: 0.5,
    backgroundColor: "#222",
    alignSelf: "stretch",
    marginVertical: 14,
  },

  infoBlock: { gap: 10, alignSelf: "stretch" },
  row: { flexDirection: "row", alignItems: "center", gap: 9 },
  rowIconWrap: { width: 20, alignItems: "center" },
  rowText: { fontSize: 13, color: "#999" },
  rowLink: { color: "#999" },

  idRow: { alignSelf: "stretch", marginBottom: 10 },
  idLabel: {
    fontSize: 9,
    letterSpacing: 1.4,
    color: "#444",
    marginBottom: 3,
  },
  idValue: {
    fontSize: 12,
    color: "#777",
    fontVariant: ["tabular-nums"],
    letterSpacing: 1,
  },

  barcode: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 28,
    gap: 2,
    alignSelf: "stretch",
    marginBottom: 16,
  },
  bar: {
    backgroundColor: "#333",
    height: "100%",
    borderRadius: 1,
  },

  bottomRow: {
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "space-between",
  },

  username: {
    fontSize: 11,
    color: "#555",
    letterSpacing: 1,
  },

  socialsRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  socialBtn: { padding: 3 },

  hint: {
    marginTop: 24,
    fontSize: 11,
    color: "#2a2a2a",
    letterSpacing: 0.5,
  },
});
