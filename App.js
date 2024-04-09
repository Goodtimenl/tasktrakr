import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Progress from "react-native-progress";
import MainApp from "./src/pages/MainApp"; // Assurez-vous que le chemin d'accès est correct
import Footer from "./src/components/footer";

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval = null;

    if (!isReady) {
      interval = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 1) {
            clearInterval(interval);
            setIsReady(true);
            return 1;
          }
          return oldProgress + 0.25; // Incrémente de 25% chaque seconde
        });
      }, 1000); // Incrémente chaque seconde
    }

    return () => clearInterval(interval);
  }, [isReady]);

  if (isReady) {
    return <MainApp />; // Afficher MainApp lorsque isReady est vrai
  }

  return (
    <LinearGradient
      colors={["#000000", "#213050"]}
      style={styles.linearGradient}
    >
      <View style={styles.container}>
        <Image source={require("./assets/logo.png")} style={styles.logo} />
        <Progress.Bar
          progress={progress}
          width={200}
          color="#FFFFFF"
          borderWidth={2}
          borderRadius={5}
        />
        <Footer />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    marginTop: 50,
    width: 200,
    height: 100,
    resizeMode: "contain",
  },
});
