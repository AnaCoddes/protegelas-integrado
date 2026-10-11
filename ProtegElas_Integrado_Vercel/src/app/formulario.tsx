// Forumlário com as perguntas

import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/nunito";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
  "Tem episódios de raiva ou fúria.",
  "Te humilha diante dos filhos.",
  "Te difama (conta ou inventa histórias a seu respeito com a intenção de manchar sua reputação).",
  "Fala mal da sua família ou amigas (os).",
  "Te xinga ou insulta sua aparência física, intelecto ou capacidades e habilidades.",
  "Diz que ninguém te ama ou vai te amar como ele.",
  "Diz que você não vale nada ou diminui seu valor.",
  "Provoca queimaduras em você (com cigarro ou qualquer objeto quente).",
  "Te amarra.",
  "Te ameaça verbalmente.",
  "Te ameaça com uso de objetos.",
  "Possui armas de fogo em casa.",
  "Grita, soca a parede ou quebra coisas em discussões.",
  "Te belisca, empurra ou aperta seu corpo com a intenção de machucar.",
  "Te ameaça de morte ou com armas.",
  "Dá tapas, socos, chutes ou outras agressões graves.",
  "Bate nos seus filhos (ou aplica punições exageradas) ou nos animais de estimação.",
  "Te obriga a fazer sexo mesmo quando você não quer.",
  "Insiste ou impõe posições sexuais desconfortáveis ou dolorosas.",
  "Te impede de usar métodos contraceptivos.",
  "Te obriga a abortar contra sua vontade, usando de métodos seguros ou não.",
  "Te obriga a se casar ou constituir união estável contra sua vontade, usando de ameaças.",
  "Confisca ou mexe no seu celular sem sua autorização.",
  "Te impede de ver, visitar ou falar com sua família e/ou amigas (os).",
  "Briga quando você vê, visita ou fala com sua família ou amigas (os).",
  "Te impede de trabalhar.",
  "Te impede de estudar.",
  "Te tranca em casa ou impede de sair.",
  "Reclama ou não gosta quando você sai sem ele.",
  "Em situações de término do relacionamento te persegue (virtualmente ou fisicamente).",
  "Destrói objetos pessoais seus (maquiagens, móveis, utensílios domésticos, materiais de trabalho, rasga roupas, etc.).",
  "Ameaça vender ou vende objetos ou bens materiais seus.",
  "Contrai dívidas ou faz empréstimos no seu nome e não quita.",
  "Retém ou se apropria de benefícios sociais destinados à família.",
  "Confisca ou não te dá acesso aos seus documentos ou dinheiro (diz que está 'cuidando').",
  "Fica agressivo com você quando faz uso de substâncias psicoativas (lícitas ou ilícitas).",
  "Fica agressivo quando é frustrado em situações que não tem relação direta com você (ex: jogo de futebol).",
  "Possui diagnóstico de doença ou transtorno de ordem psíquica e não segue tratamento.",
  "Te impede de tomar medicamentos ou fazer tratamentos de saúde.",
  "Te droga, dopa ou medica sem seu consentimento ou autorização.",
  "Pratica ou praticou algum desses atos de violência durante sua gravidez ou puerpério.",
];

const PERGUNTAS_POR_PAGINA = 8;
const TOTAL_PAGINAS = Math.ceil(perguntas.length / PERGUNTAS_POR_PAGINA);

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

  const perguntasPagina = perguntas.slice(
    pagina * PERGUNTAS_POR_PAGINA,
    pagina * PERGUNTAS_POR_PAGINA + PERGUNTAS_POR_PAGINA
  );

return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
    >
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
        Marque a seguir as situações que você identifica no seu relacionamento. Ao final, depois de enviar as respostas, você receberá informações sobre a situação de risco.
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
        <View style={styles.linhaBotoes}>
          <TouchableOpacity
            style={[styles.botao, pagina === 0 && styles.botaoInvisivel]}
            onPress={() => setPagina((atual) => Math.max(atual - 1, 0))}
            disabled={pagina === 0}
          >
            <View style={styles.setaVoltar}>
              <Setas width={30} height={22} />
            </View>
          </TouchableOpacity>

          <View style={styles.pontos}>
            {Array.from({ length: TOTAL_PAGINAS }).map((_, indice) => (
              <View
                key={indice}
                style={[styles.ponto, indice === pagina && styles.pontoAtivo]}
              />
            ))}
          </View>

          {pagina < TOTAL_PAGINAS - 1 ? (
            <TouchableOpacity
              style={styles.botao}
              onPress={() => setPagina((atual) => atual + 1)}
            >
              <Setas width={30} height={22} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.botaoEnviar}
              onPress={() => {
                // Enviar respostas do formulário para o backend
              }}
            >
              <Text style={styles.textoEnviar}>Enviar respostas</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

// StyleSheet.create
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6CDEF",
  },

  conteudo: {
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 48,
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
    borderRadius: 28,
    minHeight: 50,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginBottom: 10,
    justifyContent: "center",
  },

  pillMarcado: {
    backgroundColor: "#7B3FA0",
  },

  texto: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 14,
    lineHeight: 18,
    textAlign: "center",
    color: "#633078",
  },

  navegacao: {
    alignItems: "center",
    marginTop: 5,
  },

  pontos: {
    flexDirection: "row",
    gap: 8,
  },

  ponto: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#FFF2DF",
  },

  linhaBotoes: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },

  botaoInvisivel: {
    opacity: 0,
  },

  setaVoltar: {
    transform: [{ scaleX: -1 }]
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

  botaoEnviar: {
    backgroundColor: "#66268C",
    borderRadius: 32,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  textoEnviar: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },

  scroll: {
    flex: 1,
  },

  scrollConteudo: {
    paddingBottom: 10,
  },
});