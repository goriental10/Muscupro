import { useState } from "react";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Screen } from "../../src/components/Screen";
import { API_URL } from "../../src/lib/config";
import { saveTokens } from "../../src/lib/auth";

export default function Login() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState("");
  async function submit() {
    setError("");
    const response = await fetch(`${API_URL}/api/v1/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, client: "mobile" }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return setError(data.message ?? data.error ?? "Connexion impossible");
    await saveTokens(data.accessToken, data.refreshToken);
    router.replace("/(tabs)/dashboard");
  }
  return <Screen><View style={styles.hero}><Text style={styles.brand}>MuscuPro Global</Text><Text style={styles.title}>Connexion mobile</Text></View><TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="Courriel" placeholderTextColor="#7f8aa8" /><TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="Mot de passe" placeholderTextColor="#7f8aa8" />{error ? <Text style={styles.error}>{error}</Text> : null}<Pressable style={styles.button} onPress={submit}><Text style={styles.buttonText}>Se connecter</Text></Pressable></Screen>;
}
const styles = StyleSheet.create({ hero:{gap:8,marginTop:60,marginBottom:16}, brand:{color:"#8b5cf6",fontSize:18,fontWeight:"800"}, title:{color:"white",fontSize:30,fontWeight:"800"}, input:{backgroundColor:"#151c31",borderWidth:1,borderColor:"#27304a",color:"white",borderRadius:14,padding:14,fontSize:16}, error:{color:"#fb7185"}, button:{backgroundColor:"#7c3aed",padding:15,borderRadius:14,alignItems:"center"}, buttonText:{color:"white",fontWeight:"800"} });
