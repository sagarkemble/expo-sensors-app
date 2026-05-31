# Expo Sensors App

A modern React Native application built with **Expo**, showcasing interactive sensor-driven UI components. Features a sleek, minimalist dark theme (inspired by shadcn/ui) and fully utilizes the device's hardware sensors for a highly engaging user experience.

**Demo Video:** [Watch here](https://drive.google.com/file/d/1utgUZO_yAcBSJRElKa80fnehKIdrFIvC/view?usp=sharing)

## Features

- **3D Interactive Badges:** Tilt your device to see realistic 3D rotations on profile cards, driven smoothly by the device's gyroscope.
- **Dynamic Reflections:** Smooth shimmer, shadow, and glare effects that realistically react to your device movement.
- **Hardware Integration:** Real-time reading from Gyroscope, Accelerometer, and Light Sensors via custom hooks.
- **Minimalist UI:** Clean, dark-mode-first aesthetic with seamless tab navigation and crisp typography.
- **Fluid Animations:** Powered by `react-native-reanimated` for native-level 60fps performance and physics-based springs.

## Tech Stack

- **Framework:** React Native + [Expo](https://expo.dev)
- **Navigation:** Expo Router (File-based routing)
- **Animations:** React Native Reanimated
- **Hardware:** `expo-sensors`
- **Icons:** `lucide-react-native` & `@expo/vector-icons`
- **Package Manager:** `bun`

## Getting Started

### 1. Install Dependencies

Make sure you have `bun` installed, then run:

```bash
bun install
```

### 2. Start the Development Server

```bash
bun start
```

### 3. View the App

Scan the QR code generated in your terminal using the **Expo Go** app on your smartphone!
_(Note: Testing on a physical device is highly recommended to actually see the hardware sensors like the Gyroscope working)._

## Key File Structure

- `src/app/` - File-based screens matching to bottom tabs router (`_layout.tsx`, `gyroscope.tsx`, etc.)
- `src/hooks/` - Custom sensor hooks to cleanly pass `x`, `y`, `z` orientations into components.

---

_Built with React Native and Expo Router._
