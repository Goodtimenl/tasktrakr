import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function Footer() {
  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.iconContainer}>
        <FontAwesome name="facebook" size={30} color="#3b5998" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer}>
        <FontAwesome name="times" size={30} color="red" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer}>
        <FontAwesome name="linkedin" size={30} color="#0077b5" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingVertical: 20,
  },
  iconContainer: {
    alignItems: "center",
  },
});
