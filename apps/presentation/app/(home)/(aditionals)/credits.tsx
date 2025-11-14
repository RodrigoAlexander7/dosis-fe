import { Image } from "expo-image";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hola 👋!</Text>
      <Text style={styles.subtitle}>
        Esta aplicación fue desarrollada con mucho esmero por estudiantes de
        Ingeniería de Sistemas de la UNSA 🎓
      </Text>

      <View style={styles.card}>
        <Image
          style={styles.image}
          source={require("@/assets/images/Escudo_UNSA.png")}
          placeholder={blurhash}
          contentFit="contain"
          transition={800}
        />
      </View>

      <Text style={styles.sectionTitle}>Esperamos que te sea muy útil</Text>
      <Text style={styles.sectionSubtitle}>Equipo de desarrollo:</Text>

      <FlatList
        style={styles.list}
        data={[
          { key: "Rodrigo Fernandez Huarca" },
          { key: "Miguel Alvarez Choque" },
          { key: "Eduardo Cuno Salazar" },
        ]}
        renderItem={({ item }) => <Text style={styles.item}>{item.key}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#475569",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    width: "100%",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 4,
    color: "#0f172a",
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#334155",
    marginBottom: 8,
  },
  list: {
    width: "100%",
  },
  item: {
    fontSize: 15,
    color: "#1e293b",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
    marginBottom: 6,
  },
});
