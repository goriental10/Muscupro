import type { ExpoConfig } from "expo/config";

const env = (globalThis as typeof globalThis & {
  process?: { env?: Record<string, string | undefined> };
}).process?.env ?? {};

const extra: ExpoConfig["extra"] = {
  apiUrl: env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000",
  eas: {
    projectId:
      env.EXPO_PUBLIC_EAS_PROJECT_ID ??
      "193bdb66-26e1-4c24-a38c-55e2016a1398"
  }
};

const config: ExpoConfig = {
  name: "MuscuPro Global",
  slug: "muscupro-global",
  version: "1.0.0",
  icon: "./assets/icon.png",
  orientation: "portrait",
  scheme: "muscupro",
  platforms: ["ios", "android"],
  userInterfaceStyle: "dark",
  ios: {
    bundleIdentifier: "com.goriental10.muscupro",
    supportsTablet: true
  },
  android: {
    package: "com.goriental10.muscupro",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#050708"
    }
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    [
      "@kingstinct/react-native-healthkit",
      {
        NSHealthShareUsageDescription: "MuscuPro lit les données d’activité que vous choisissez de synchroniser.",
        NSHealthUpdateUsageDescription: "MuscuPro enregistre uniquement les données que vous choisissez de partager."
      }
    ],
    "react-native-health-connect",
    ["expo-build-properties", { android: { minSdkVersion: 26 } }]
  ],
  experiments: { typedRoutes: true },
  extra
};

export default config;
