
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

export default function Resultado() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
    >
      <Text style={styles.titulo}>ProtegElas</Text>

      <View style={styles.cartao}>
        <Text style={styles.coracao}>♡</Text>

        <Text style={styles.subtitulo}>
          Você merece ser ouvida.
        </Text>

        <Text style={styles.descricao}>
          Obrigada por responder ao questionário.
          Suas respostas são importantes e merecem
          atenção, respeito e acolhimento.
        </Text>
      </View>

      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>
          Sua avaliação
        </Text>

        <Text style={styles.texto}>
          Aqui aparecerá a avaliação de acordo com as respostas fornecidas.
          
        </Text>
      </View>

      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>
          Mensagem de acolhimento a definir
        </Text>

        <Text style={styles.texto}>
          -------- mensagem
        </Text>

        <Text style={styles.ajuda}>
          Central de Atendimento à Mulher: 180
        </Text>

        <Text style={styles.texto}>
          Em caso de emergência, ligue 190.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => router.replace("/")}
        accessibilityRole="button"
      >
        <Text style={styles.textoBotao}>
          Voltar ao início
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8FC",
  },
  conteudo: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#66268C",
    textAlign: "center",
    marginBottom: 30,
  },
  cartao: {
    backgroundColor: "#F0E3F7",
    padding: 28,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 22,
  },
  coracao: {
    fontSize: 52,
    color: "#66268C",
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#66268C",
    textAlign: "center",
    marginBottom: 12,
  },
  descricao: {
    fontSize: 16,
    lineHeight: 25,
    color: "#4D4056",
    textAlign: "center",
  },
  secao: {
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#EADCF2",
  },
  tituloSecao: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#66268C",
    marginBottom: 12,
  },
  texto: {
    fontSize: 15,
    lineHeight: 24,
    color: "#51465B",
  },
  ajuda: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#66268C",
    marginTop: 15,
    marginBottom: 8,
  },
  botao: {
    backgroundColor: "#66268C",
    paddingVertical: 17,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 15,
  },
  textoBotao: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
