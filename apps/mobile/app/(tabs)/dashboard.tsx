import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { Screen } from "../../src/components/Screen";
import { Card } from "../../src/components/Card";
import { api } from "../../src/lib/api";
export default function Dashboard() {
  const [data,setData]=useState<any>(null); const [error,setError]=useState("");
  useEffect(()=>{api<any>("/api/v1/dashboard").then(setData).catch(e=>setError(e.message));},[]);
  return <Screen>{error?<Text style={s.error}>{error}</Text>:null}<Card title="Semaine"> <Text style={s.value}>{data?.workouts?.completedThisWeek ?? "—"} séances</Text><Text style={s.muted}>Volume: {data?.workouts?.volumeThisWeek ?? "—"} kg</Text></Card><Card title="Nutrition"><Text style={s.value}>{data?.nutrition?.calories ?? "—"} kcal</Text><Text style={s.muted}>Protéines: {data?.nutrition?.protein ?? "—"} g</Text></Card><Card title="Progression"><Text style={s.value}>{data?.progress?.currentWeightKg ?? "—"} kg</Text><Text style={s.muted}>Objectif: {data?.progress?.goalWeightKg ?? "—"} kg</Text></Card></Screen>;
}
const s=StyleSheet.create({value:{color:"white",fontSize:26,fontWeight:"800"},muted:{color:"#94a3b8"},error:{color:"#fb7185"}});
