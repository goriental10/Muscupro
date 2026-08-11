import Constants from "expo-constants";

export const API_URL = String(Constants.expoConfig?.extra?.apiUrl ?? "http://localhost:4000").replace(/\/$/, "");
