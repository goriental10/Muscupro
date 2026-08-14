import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#0b1020" },
        headerTintColor: "#fff",
        tabBarStyle: { backgroundColor: "#111827", borderTopColor: "#27304a" },
        tabBarActiveTintColor: "#a78bfa",
        tabBarInactiveTintColor: "#94a3b8"
      }}
    >
      <Tabs.Screen name="dashboard" options={{ title: "Accueil" }} />
      <Tabs.Screen name="workouts" options={{ title: "Séances" }} />
      <Tabs.Screen name="nutrition" options={{ title: "Nutrition" }} />
      <Tabs.Screen name="progress" options={{ title: "Progression" }} />
      <Tabs.Screen name="health" options={{ title: "Santé" }} />
    </Tabs>
  );
}
