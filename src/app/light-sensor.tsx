import useLightSensor from "@/hooks/use-lightsensor";
import {
  CloudMoon,
  Lightbulb,
  Moon,
  Sun,
  SunMedium,
} from "lucide-react-native";
import { useEffect } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Svg, { Circle, G, Path } from "react-native-svg";

const { width } = Dimensions.get("window");
const SIZE = width * 0.78;
const CX = SIZE / 2;
const CY = SIZE / 2 + 20;
const R = SIZE * 0.36;

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);

// Lux breakpoints
const LEVELS = [
  { max: 10, icon: Moon, label: "Dark", color: "#1e1e2e", arc: "#2a2a3a" },
  { max: 100, icon: CloudMoon, label: "Dim", color: "#3b3b5c", arc: "#5555aa" },
  {
    max: 500,
    icon: Lightbulb,
    label: "Indoor",
    color: "#7c6f3e",
    arc: "#d4a843",
  },
  {
    max: 5000,
    icon: SunMedium,
    label: "Bright",
    color: "#8a6a1a",
    arc: "#f5c518",
  },
  {
    max: Infinity,
    icon: Sun,
    label: "Sunny",
    color: "#7a4a10",
    arc: "#ff8c00",
  },
];

function getLevel(lux: number) {
  return LEVELS.find((l) => lux < l.max) ?? LEVELS[LEVELS.length - 1];
}

// Map lux → 0..1 on a log scale (0 lux = 0, 100k lux = 1)
function luxToProgress(lux: number): number {
  "worklet";
  if (lux <= 0) return 0;
  const log = Math.log10(Math.min(lux, 100000) + 1);
  return Math.min(log / Math.log10(100001), 1);
}

// Gauge arc: goes from 210° to 330° (240° sweep), so start=-210°, end=-330° in SVG coords
// In SVG: 0° = right. We want start at bottom-left (210° from right = 210° clockwise)
const START_ANGLE = 210; // degrees clockwise from right
const SWEEP = 240;

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  "worklet";
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) {
  "worklet";
  const s = polarToXY(cx, cy, r, startAngle);
  const e = polarToXY(cx, cy, r, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

// Tick mark angles
const TICKS = [0, 0.2, 0.4, 0.6, 0.8, 1.0].map((t) => {
  const angle = START_ANGLE - 90 + t * SWEEP; // offset because polarToXY uses -90
  return { t, angle: START_ANGLE - 90 + t * SWEEP };
});

const LUX_LABELS = ["0", "1", "10", "100", "1k", "100k"];

export default function SunMeter() {
  const { available, illuminance } = useLightSensor();
  const lux = illuminance ?? 0;
  const level = getLevel(lux);

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(luxToProgress(lux), {
      damping: 20,
      stiffness: 120,
    });
  }, [lux]);

  const arcProps = useAnimatedProps(() => {
    const endAngle = START_ANGLE - 90 + progress.value * SWEEP;
    const startA = START_ANGLE - 90;
    if (progress.value <= 0.001) {
      return { d: `M ${CX} ${CY}` };
    }
    const s = polarToXY(CX, CY, R, startA + 90);
    const e = polarToXY(CX, CY, R, endAngle + 90);
    const large = progress.value * SWEEP > 180 ? 1 : 0;
    return {
      d: `M ${s.x} ${s.y} A ${R} ${R} 0 ${large} 1 ${e.x} ${e.y}`,
    };
  });

  const needleProps = useAnimatedProps(() => {
    const angle = START_ANGLE - 90 + progress.value * SWEEP + 90;
    const rad = ((angle - 90) * Math.PI) / 180;
    const tip = {
      x: CX + (R - 4) * Math.cos(rad),
      y: CY + (R - 4) * Math.sin(rad),
    };
    const base1 = {
      x: CX + 7 * Math.cos(rad + Math.PI / 2),
      y: CY + 7 * Math.sin(rad + Math.PI / 2),
    };
    const base2 = {
      x: CX + 7 * Math.cos(rad - Math.PI / 2),
      y: CY + 7 * Math.sin(rad - Math.PI / 2),
    };
    return {
      d: `M ${base1.x} ${base1.y} L ${tip.x} ${tip.y} L ${base2.x} ${base2.y} Z`,
    };
  });

  // Static full-track arc path
  const fullArcStart = polarToXY(CX, CY, R, START_ANGLE);
  const fullArcEnd = polarToXY(CX, CY, R, START_ANGLE + SWEEP);
  const fullArcPath = `M ${fullArcStart.x} ${fullArcStart.y} A ${R} ${R} 0 1 1 ${fullArcEnd.x} ${fullArcEnd.y}`;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Title */}
        <View style={styles.titleRow}>
          <View style={styles.iconBox}>
            <Text style={styles.iconGlyph}>◉</Text>
          </View>
          <Text style={styles.title}>sun meter</Text>
        </View>

        {/* Gauge SVG */}
        <View style={styles.gaugeWrap}>
          <Svg width={SIZE} height={SIZE * 0.62}>
            {/* Track */}
            <Path
              d={fullArcPath}
              fill="none"
              stroke="#1f1f1f"
              strokeWidth={14}
              strokeLinecap="round"
            />

            {/* Filled arc */}
            <AnimatedPath
              animatedProps={arcProps}
              fill="none"
              stroke={level.arc}
              strokeWidth={14}
              strokeLinecap="round"
            />

            {/* Tick marks + labels */}
            {TICKS.map(({ t, angle }, i) => {
              const inner = polarToXY(CX, CY, R - 22, angle + 90);
              const outer = polarToXY(CX, CY, R + 22, angle + 90);
              const labelPos = polarToXY(CX, CY, R + 38, angle + 90);
              return (
                <G key={i}>
                  <Path
                    d={`M ${inner.x} ${inner.y} L ${outer.x} ${outer.y}`}
                    stroke="#2a2a2a"
                    strokeWidth={1}
                  />
                </G>
              );
            })}

            {/* Needle */}
            <AnimatedPath
              animatedProps={needleProps}
              fill="#e8e8e8"
              opacity={0.9}
            />

            {/* Needle pivot */}
            <Circle
              cx={CX}
              cy={CY}
              r={8}
              fill="#1a1a1a"
              stroke="#333"
              strokeWidth={1}
            />
            <Circle cx={CX} cy={CY} r={3} fill="#888" />
          </Svg>
        </View>

        {/* Lux value */}
        <View style={styles.luxRow}>
          <Text style={styles.luxValue}>
            {lux >= 1000
              ? (lux / 1000).toFixed(1) + "k"
              : Math.round(lux).toString()}
          </Text>
          <Text style={styles.luxUnit}>lux</Text>
        </View>

        {/* Icon + label */}
        <View style={styles.levelRow}>
          <level.icon size={32} color={level.arc} />
          <Text style={[styles.levelLabel, { color: level.arc }]}>
            {level.label}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Scale reference */}
        <View style={styles.scaleRow}>
          {LEVELS.map((l) => (
            <View key={l.label} style={styles.scaleItem}>
              <View
                style={[
                  styles.scaleDot,
                  {
                    backgroundColor:
                      l.label === level.label ? l.arc : "#2a2a2a",
                  },
                ]}
              />
              <View style={styles.scaleIconLabel}>
                <l.icon
                  size={14}
                  color={l.label === level.label ? l.arc : "#555"}
                />
                <Text
                  style={[
                    styles.scaleLabel,
                    l.label === level.label && { color: l.arc },
                  ]}
                >
                  {l.label}
                </Text>
              </View>
            </View>
          ))}
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
    alignItems: "center",
  },

  // Header
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    alignSelf: "flex-start",
    marginBottom: 8,
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
  iconGlyph: { color: "#555", fontSize: 14 },
  title: {
    fontSize: 13,
    fontWeight: "500",
    color: "#888",
    letterSpacing: 0.6,
  },

  // Gauge
  gaugeWrap: {
    marginTop: 8,
    marginBottom: 0,
    alignItems: "center",
  },

  // Lux
  luxRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginTop: -8,
  },
  luxValue: {
    fontSize: 52,
    fontWeight: "500",
    color: "#e8e8e8",
    fontVariant: ["tabular-nums"],
    lineHeight: 60,
  },
  luxUnit: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },

  // Level
  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  levelLabel: {
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.4,
  },

  // Divider
  divider: {
    height: 0.5,
    backgroundColor: "#1f1f1f",
    alignSelf: "stretch",
    marginBottom: 16,
  },

  // Scale
  scaleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    alignSelf: "stretch",
  },
  scaleItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  scaleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  scaleIconLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  scaleLabel: {
    fontSize: 11,
    color: "#3a3a3a",
    letterSpacing: 0.3,
  },
});
