import {
  SpaceGrotesk_700Bold,
  useFonts,
} from '@expo-google-fonts/space-grotesk';

import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  lerToken,
  listarRespostas,
  removerToken,
  Resposta,
} from '../services/api';

const COLORS = {
  lavender: '#D9C6EE',
  purple: '#6B2A85',
  button: '#B08BD0',
  cream: '#FFF1DC',
  white: '#FFFFFF',
  text: '#3C2345',
  error: '#A52A2A',
};

function formatarData(valor: unknown) {
  if (typeof valor !== 'string') return 'Data não informada';

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) return 'Data não informada';

  return data.toLocaleString('pt-BR');
}

function formatarValor(valor: unknown) {
  if (valor === null || valor === undefined || valor === '') {
    return 'Não informado';
  }

  if (typeof valor === 'object') {
    return JSON.stringify(valor);
  }

  return String(valor);
}

export default function PainelScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [autorizada, setAutorizada] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [registros, setRegistros] = useState<Resposta[]>([]);

  const [fontsLoaded] = useFonts({ SpaceGrotesk_700Bold });

  useEffect(() => {
    let ativo = true;

    async function carregarPainel() {
      try {
        const token = await lerToken();

        if (!token) {
          router.replace('/tela-login');
          return;
        }

        if (ativo) {
          setAutorizada(true);
        }

        const respostasSalvas = await listarRespostas();

        if (ativo) {
          setRegistros(respostasSalvas);
          setErro('');
        }
      } catch (error) {
        if (ativo) {
          setErro(
            error instanceof Error
              ? error.message
              : 'Não foi possível carregar as respostas.'
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarPainel();

    return () => {
      ativo = false;
    };
  }, [router]);

  const sair = async () => {
    await removerToken();
    router.replace('/');
  };

  if (!fontsLoaded || !autorizada) {
    return null;
  }

  const screenWidth = Platform.OS === 'web'
    ? Math.min(width, 760)
    : width;

    return (
      <View style={styles.webWrapper}>
        <StatusBar barStyle="light-content" />

        <SafeAreaView style={[styles.container, { width: screenWidth }]}>
          <View style={styles.header}>
           <Image
              source={require('./assets/images/simbolo.png')}
              resizeMode="contain"
              style={styles.logo}
      />

          <View style={styles.headerText}>
            <Text style={styles.title}>Painel de respostas</Text>
            <Text style={styles.subtitle}>
              Acesso exclusivo para pesquisadoras
            </Text>
          </View>

          <Pressable
            onPress={sair}
            accessibilityRole="button"
            accessibilityLabel="Sair da conta"
            style={({ pressed }) => [
              styles.exitButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.exitButtonText}>SAIR</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {carregando && (
            <View style={styles.messageBox}>
              <ActivityIndicator size="large" color={COLORS.purple} />
              <Text style={styles.messageText}>
                Carregando respostas...
              </Text>
            </View>
          )}

          {!carregando && erro !== '' && (
            <View style={styles.errorBox}>
              <Text style={styles.errorTitle}>
                Não foi possível carregar os registros
              </Text>
              <Text style={styles.errorText}>{erro}</Text>
            </View>
          )}

          {!carregando && erro === '' && registros.length === 0 && (
            <View style={styles.messageBox}>
              <Text style={styles.messageTitle}>
                Nenhuma resposta encontrada
              </Text>
              <Text style={styles.messageText}>
                Os questionários enviados aparecerão aqui.
              </Text>
            </View>
          )}

          {!carregando && erro === '' && registros.length > 0 && (
            <>
              <Text style={styles.total}>
                {registros.length}{' '}
                {registros.length === 1
                  ? 'registro encontrado'
                  : 'registros encontrados'}
              </Text>

              {registros.map((registro) => (
                <View key={registro.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>
                      Registro #{registro.id}
                    </Text>

                    <Text style={styles.cardDate}>
                      {formatarData(registro.criado_em)}
                    </Text>
                  </View>

                  <View style={styles.locationBox}>
                    <Text style={styles.sectionTitle}>Localização</Text>

                    <Text style={styles.locationText}>
                      Latitude: {registro.latitude}
                    </Text>

                    <Text style={styles.locationText}>
                      Longitude: {registro.longitude}
                    </Text>
                  </View>

                  <Text style={styles.sectionTitle}>Respostas</Text>

                  {Object.entries(registro.respostas ??{}).map(
                    ([pergunta, resposta]) => (
                      <View
                        key={`${registro.id}-${pergunta}`}
                        style={styles.answerRow}
                      >
                        <Text style={styles.questionText}>
                          {pergunta}
                        </Text>

                        <Text style={styles.answerText}>
                          {formatarValor(resposta)}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  webWrapper: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#E5E5E5',
  },

  container: {
    flex: 1,
    maxWidth: 760,
    backgroundColor: COLORS.cream,
  },

  header: {
    minHeight: 105,
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: COLORS.purple,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  logo: {
    width: 58,
    height: 58,
  },

  headerText: {
    flex: 1,
  },

  title: {
    color: COLORS.white,
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 23,
  },

  subtitle: {
    color: COLORS.lavender,
    fontSize: 13,
    marginTop: 3,
  },

  exitButton: {
    backgroundColor: COLORS.button,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  exitButtonText: {
    color: COLORS.white,
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 12,
  },

  pressed: {
    opacity: 0.8,
  },

  content: {
    padding: 18,
    paddingBottom: 40,
  },

  total: {
    color: COLORS.text,
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 16,
    marginBottom: 14,
  },

  messageBox: {
    minHeight: 180,
    borderRadius: 16,
    padding: 24,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },

  messageTitle: {
    color: COLORS.purple,
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 18,
    textAlign: 'center',
  },

  messageText: {
    color: COLORS.text,
    fontSize: 14,
    textAlign: 'center',
  },

  errorBox: {
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#FFE7E7',
  },

  errorTitle: {
    color: COLORS.error,
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 17,
    marginBottom: 8,
  },

  errorText: {
    color: COLORS.error,
    fontSize: 14,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.lavender,
  },

  cardHeader: {
    marginBottom: 14,
  },

  cardTitle: {
    color: COLORS.purple,
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 19,
  },

  cardDate: {
    color: '#735E78',
    fontSize: 12,
    marginTop: 3,
  },

  locationBox: {
    borderRadius: 12,
    padding: 13,
    marginBottom: 16,
    backgroundColor: COLORS.cream,
  },

  sectionTitle: {
    color: COLORS.purple,
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 15,
    marginBottom: 7,
  },

  locationText: {
    color: COLORS.text,
    fontSize: 13,
    marginTop: 2,
  },

  answerRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE4F3',
  },

  questionText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },

  answerText: {
    color: COLORS.purple,
    fontSize: 14,
    marginTop: 4,
  },
});