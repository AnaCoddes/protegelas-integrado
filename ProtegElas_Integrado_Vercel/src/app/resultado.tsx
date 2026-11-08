import {
  Nunito_400Regular,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/nunito";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { NivelRisco, RESULTADOS } from "../utils/resultado";

// Cores de cada nível
const CORES: Record<NivelRisco, string> = {
  moderado: "#FFE599",
  grave: "#F9CB9C",
  extremo: "#E06666",
};

export default function Resultado() {
  const router = useRouter();
  
  // Lê o que a tela anterior mandou
  const { nivel } = useLocalSearchParams<{ nivel: string }>();

  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const resultado = RESULTADOS[nivel as NivelRisco];
  const cor = CORES[nivel as NivelRisco];

  // Se chegar aqui sem um nível válido, mostra um aviso
  if (!resultado) {
    return (
      <View style={styles.container}>
        <View style={styles.conteudo}>
          <Text style={styles.titulo}>Resultado indisponível</Text>
          <TouchableOpacity
            style={styles.botao}
            onPress={() => router.replace("/")}
          >
            <Text style={styles.textoBotao}>Voltar ao início</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
    >
      <View style={[styles.faixa, { backgroundColor: cor }]}>
        <Text style={styles.faixaTexto}>{resultado.titulo}</Text>
      </View>

      <Text style={styles.introducao}>{resultado.introducao}</Text>

      <Text style={styles.subtitulo}>{resultado.recomendacaoTitulo}</Text>

      {resultado.recomendacoes.map((recomendacao) => (
        <View key={recomendacao} style={styles.item}>
          <Text style={styles.marcador}>•</Text>
          <Text style={styles.itemTexto}>{recomendacao}</Text>
        </View>
      ))}

      <TouchableOpacity
        style={styles.botao}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.textoBotao}>Voltar ao início</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6CDEF",
  },

  conteudo: {
    paddingHorizontal: 28,
    paddingTop: 64,
    paddingBottom: 48,
  },

  titulo: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 28,
    color: "#552477",
    textAlign: "center",
    marginBottom: 20,
  },

  faixa: {
    borderWidth: 2,
    borderColor: "#42454C",
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 20,
  },

  faixaTexto: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 26,
    color: "#42454C",
  },

  introducao: {
    fontFamily: "Nunito_400Regular",
    fontSize: 16,
    lineHeight: 22,
    color: "#633B72",
    marginBottom: 20,
  },

  subtitulo: {
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
    color: "#552477",
    marginBottom: 10,
  },

  item: {
    flexDirection: "row",
    marginBottom: 10,
  },

  marcador: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: "#633B72",
    marginRight: 8,
  },

  itemTexto: {
    flex: 1,
    fontFamily: "Nunito_400Regular",
    fontSize: 15,
    lineHeight: 21,
    color: "#633B72",
  },

  botao: {
    backgroundColor: "#66268C",
    borderRadius: 32,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 24,
  },

  textoBotao: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
});