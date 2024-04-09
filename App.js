import React, { useState, useEffect } from "react";
import {
  StatusBar,
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import * as Font from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

export default function App() {
  const [clientName, setClientName] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [taskName, setTaskName] = useState("");
  const [tasks, setTasks] = useState([]);

  // Methode d'ajout de fonts dans le projet
  Font.useFonts({
    MontEl: require("./assets/Montserrat-ExtraLight.ttf"),
    MontL: require("./assets/Montserrat-Light.ttf"),
    MontM: require("./assets/Montserrat-Medium.ttf"),
    MontR: require("./assets/Montserrat-Regular.ttf"),
    MontSb: require("./assets/Montserrat-SemiBold.ttf"),
    MontT: require("./assets/Montserrat-Thin.ttf"),
  });

  // Là bah c la logique pour un ajout de tâche
  const addTask = () => {
    const newTask = {
      clientName,
      hourlyRate: parseFloat(hourlyRate) || 0,
      taskName,
      isRunning: false,
      timeElapsed: 0,
      timer: null,
    };
    setTasks([...tasks, newTask]);
    setClientName("");
    setHourlyRate("");
    setTaskName("");
    saveTasks();
  };

  // ici c la logique pour un supprimer une tâche
  const deleteTask = (index) => {
    setTasks((currentTasks) => {
      const newTasks = [...currentTasks];
      // Arrêter le chronomètre si la tâche est en cours d'exécution
      if (newTasks[index].isRunning) {
        clearInterval(newTasks[index].timer);
      }
      // Supprimer la tâche du tableau
      newTasks.splice(index, 1);
      return newTasks;
    });
    saveTasks();
  };

  // logique pour le start de du timer
  const startTimer = (index) => {
    setTasks(
      tasks.map((task, i) => {
        if (i === index) {
          // Annuler l'intervalle précédent avant d'en démarrer un nouveau
          if (task.timer) clearInterval(task.timer);

          return {
            ...task,
            isRunning: true,
            // ici on va demarrer un nouvel interval en recuperant son id
            timer: setInterval(() => {
              setTasks((currentTasks) =>
                currentTasks.map((innerTask, j) => {
                  if (j === index) {
                    return {
                      ...innerTask,
                      timeElapsed: innerTask.timeElapsed + 1,
                    };
                  }
                  return innerTask;
                })
              );
            }, 1000),
          };
        }
        return task;
      })
    );
  };

  // bah la on a la logique de la mise en pause
  const pauseTimer = (index) => {
    setTasks(
      tasks.map((task, i) => {
        if (i === index) {
          clearInterval(task.timer); // Arrêter le timer
          return { ...task, isRunning: false, timer: null };
        }
        return task;
      })
    );
    saveTasks();
  };

  // logique pour arreter le chronomètre pour une tâche
  const stopTimer = (index) => {
    setTasks(
      tasks.map((task, i) => {
        if (i === index) {
          clearInterval(task.timer); // Arrêter le timer
          return { ...task, isRunning: false, timeElapsed: 0, timer: null }; // Réinitialiser le temps et marquer comme non en cours
        }
        return task;
      })
    );
    saveTasks();
  };

  // Logique pour le calcul de ce qu'on gagne en temps reel
  const calculateEarnings = (hourlyRate, timeElapsedInSeconds) => {
    const hours = timeElapsedInSeconds / 3600;
    return (hourlyRate * hours).toFixed(2); // Arrondit le résultat à deux chiffres après la virgule
  };

  // Sauvegarder dans l'equivalent du local storage "AsyncStorage"
  const saveTasks = async () => {
    try {
      const jsonTasks = JSON.stringify(tasks);
      await AsyncStorage.setItem("tasks", jsonTasks);
    } catch (e) {
      console.error("Erreur de sauvegarde des tâches", e);
    }
  };

  // recup des taches en cours au demarrage de l'app
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const jsonTasks = await AsyncStorage.getItem("tasks");
        if (jsonTasks != null) {
          setTasks(JSON.parse(jsonTasks));
        }
      } catch (e) {
        console.error("Erreur de chargement des tâches", e);
      }
    };

    loadTasks();
    return () => tasks.forEach((task) => clearInterval(task.timer)); // Nettoyer les intervalles
  }, []);

  return (
    <LinearGradient
      colors={["#000000", "#213050"]}
      style={styles.linearGradient}
    >
      <StatusBar />
      <Image source={require("./assets/logo.png")} style={styles.logo} />
      <SafeAreaView style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nom du client"
            placeholderTextColor="#595959"
            onChangeText={setClientName}
          />

          <TextInput
            style={styles.input}
            placeholder="Taux horaire"
            placeholderTextColor="#595959"
            value={hourlyRate}
            keyboardType="numeric"
            onChangeText={setHourlyRate}
          />

          <TextInput
            style={styles.input}
            placeholder="Nom de la tâche"
            placeholderTextColor="#595959"
            value={taskName}
            onChangeText={setTaskName}
          />
          <TouchableOpacity onPress={addTask} style={styles.addButton}>
            <Text style={styles.addButtonText}>Ajouter une tâche</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tasksContainer}>
          <ScrollView horizontal>
            {tasks.map((task, index) => (
              <View key={index} style={styles.task}>
                {/* Bouton Supprimer personnalisé */}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteTask(index)}
                >
                  <Text style={styles.deleteButtonText}>X</Text>
                </TouchableOpacity>

                {/* J'utlise */}
                <View style={styles.taskHeader}>
                  <Text style={styles.taskTitle}>{task.clientName}</Text>
                </View>
                <View style={styles.taskContent}>
                  <Text style={styles.taskDetail}>Tâche: {task.taskName}</Text>
                  <Text style={styles.taskDetail}>
                    Taux horaire: {task.hourlyRate}€/h
                  </Text>
                  {/* Style pour le temps */}
                  <Text style={styles.time}>
                    {Math.floor(task.timeElapsed / 3600)}h{" "}
                    {Math.floor((task.timeElapsed % 3600) / 60)}m{" "}
                    {task.timeElapsed % 60}s
                  </Text>
                  {/* Affichage des gains en temps réel */}
                  <Text style={styles.earnings}>
                    Gains:{" "}
                    {calculateEarnings(task.hourlyRate, task.timeElapsed)}€
                  </Text>
                </View>

                {/* Conteneur pour les boutons */}
                <View style={styles.buttonContainer}>
                  {/* Boutons de contrôle */}
                  <TouchableOpacity
                    onPress={() =>
                      task.isRunning ? pauseTimer(index) : startTimer(index)
                    }
                    style={styles.buttonPda}
                  >
                    <Text style={styles.buttonText}>
                      {task.isRunning ? "Pause" : "Démarrer"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => stopTimer(index)}
                    style={[styles.buttonPda, styles.buttonStop]}
                  >
                    <Text style={styles.buttonText}>Réinitialiser</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    alignItems: "start",
  },

  logo: {
    marginTop: 50,
    width: 200,
    height: 100,
    resizeMode: "contain",
  },

  container: {
    flex: 1,
    width: "100%",
    justifyContent: "start",
  },

  inputContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  input: {
    padding: 5,
    height: 50,
    width: "85%",
    borderColor: "#595959",
    borderWidth: 1,
    marginBottom: 10,
    color: "#FFFFFF",
  },

  addButton: {
    marginTop: 10,
    backgroundColor: "#d4d4d4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderColor: "#d4d4d4",
    borderWidth: 1,
  },

  addButtonText: {
    fontFamily: "MontM",
    color: "#213050",
    fontSize: 16,
    textAlign: "center",
  },

  taskContainers: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingStart: 30,
    marginBottom: 100,
  },

  task: {
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.67)",
    marginHorizontal: 10,
    marginBottom: 100,
  },

  taskContent: {
    padding: 20,
    width: "100%",
  },

  taskHeader: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },

  deleteButton: {
    zIndex: 1,
    position: "absolute",
    right: 5,
    top: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },

  deleteButtonText: {
    fontFamily: "MontSb",
    color: "grey",
    fontSize: 20,
  },

  taskTitle: {
    fontFamily: "MontSb",
    fontSize: 30,
    color: "#FFFFFF",
  },

  taskDetail: {
    fontFamily: "MontL",
    marginBottom: 5,
    fontSize: 20,
    color: "#FFFFFF",
  },

  time: {
    marginTop: 10,
    fontFamily: "MontL",
    fontSize: 30,
    color: "white",
  },

  buttonContainer: {
    color: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },

  buttonPda: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 6,
    margin: 5,
  },

  earnings: {
    fontFamily: "MontL",
    color: "#00cfd4",
  },

  buttonText: {
    fontFamily: "MontM",
    color: "#FFFFFF", // Définit la couleur du texte en blanc
    fontSize: 14, // Vous pouvez ajuster la taille selon vos besoins
    // Ajoutez d'autres propriétés de style comme nécessaire
  },
});
