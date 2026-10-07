// Aqui é onde ficará o forumlário com as perguntas

import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/nunito";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Image } from "react-native";
import Setas from "./setas";

const perguntas = [
  "Te trai.",
  "Tem ciúmes excessivos.",
  "Te ridiculariza/humilha em público ou em particular.",
  "Te ignora ou se recusa a se comunicar com você após brigas discussões ou desentendimentos leves.",
  "Critica ou faz piada do seu desempenho sexual ou das suas partes íntimas.",
  "Ameaça terminar com você ou te abandonar.",
  "Te obriga a prestar contas do que você gasta ou compra.",
];

export default function Formulario() {
  const [respostas, setRespostas] = useState<Record<string, boolean>>({});
  const [pagina, setPagina] = useState(0);

  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  function alternar(pergunta: string) {
    setRespostas((anterior) => ({
      ...anterior,
      [pergunta]: !anterior[pergunta],
    }));
  }

  const perguntasPagina =
    pagina === 0 ? perguntas.slice(0, 4) : perguntas.slice(4, 7);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/logo-oficial.png")}
          style={{ width: 58, height: 58 }}
        />
        <Text style={styles.logo}>
          proteg<Text style={styles.logoElas}>ELAS</Text>
        </Text>
      </View>

      <Text style={styles.subtitulo}>
        Autoavaliação de Risco e Cuidado para Mulheres
      </Text>

      <Text style={styles.titulo}>Autoavaliação do Relacionamento</Text>
      <Text style={styles.descricao}>
        Selecione as situações que já aconteceram no seu relacionamento.
      </Text>

      {perguntasPagina.map((pergunta) => (
        <TouchableOpacity
          key={pergunta}
          style={[styles.pill, respostas[pergunta] && styles.pillMarcado]}
          onPress={() => alternar(pergunta)}
        >
          <Text
            style={[styles.texto, respostas[pergunta] && styles.textoMarcado]}
          >
            {pergunta}
          </Text>
        </TouchableOpacity>
      ))}

      <View style={styles.navegacao}>
        <View style={styles.pontos}>
          <View style={[styles.ponto, styles.pontoAtivo]} />
          <View style={styles.ponto} />
          <View style={styles.ponto} />
        </View>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => setPagina(pagina === 0 ? 1 : 0)}
        >
          <Setas />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// O "CSS" da coisa
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6CDEF",
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 25,
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },

  logo: {
    fontFamily: "Nunito_700Bold",
    fontSize: 31,
    color: "#66268C",
    letterSpacing: -1,
  },

  logoElas: {
    fontFamily: "Nunito_800ExtraBold",
  },

  subtitulo: {
    fontFamily: "Nunito_400Regular",
    fontSize: 12,
    color: "#66268C",
    textAlign: "center",
    marginBottom: 38,
  },

  titulo: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 39,
    lineHeight: 42,
    color: "#552477",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -1,
  },

  descricao: {
    fontFamily: "Nunito_400Regular",
    fontSize: 15,
    lineHeight: 19,
    color: "#633B72",
    marginBottom: 20,
  },

  pill: {
    backgroundColor: "#FFF2DF",
    borderWidth: 2,
    borderColor: "#42454C",
    borderRadius: 32,
    minHeight: 61,
    paddingHorizontal: 20,
    paddingVertical: 13,
    marginBottom: 13,
    justifyContent: "center",
  },

  pillMarcado: {
    backgroundColor: "#7B3FA0",
  },

  texto: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 16,
    lineHeight: 20,
    textAlign: "center",
    color: "#633078",
  },

  navegacao: {
    alignItems: "center",
    marginTop: 5,
  },

  pontos: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 14,
  },

  ponto: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: "#FFF2DF",
  },

  pontoAtivo: {
    backgroundColor: "#66268C",
  },

  botao: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },

  textoMarcado: {
    color: "#FFFFFF",
  },
});
