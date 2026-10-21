import {
  SpaceGrotesk_700Bold,
  useFonts,
} from '@expo-google-fonts/space-grotesk';

import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { lerToken, removerToken } from '../services/api';

const COLORS = {
  lavender: '#D9C6EE',
  purple: '#6B2A85',
  button: '#B08BD0',
  cream: '#FFF1DC',
};

export default function PainelScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const [autorizada, setAutorizada] = useState(false);

  const [fontsLoaded] = useFonts({ SpaceGrotesk_700Bold });

  // Só mostra o painel se houver uma pesquisadora logada (token salvo)
  useEffect(() => {
    lerToken().then((token) => {
      if (!token) {
        router.replace('/tela-login'); // ajuste se o nome da sua rota de login for outro
      } else {
        setAutorizada(true);
      }
    });
  }, [router]);

  if (!fontsLoaded || !autorizada) return null;

  const screenWidth = Platform.OS === 'web' ? Math.min(width, 390) : width;
  const waveHeight = 70;
  const patternHeight = height * 0.28;

  const sair = async () => {
    await removerToken();
    router.replace('/');
  };

  return (
    <View style={styles.webWrapper}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        {/* Padrão de flores do topo */}
        <ImageBackground
          source={require('./assets/images/flower.png')}
          resizeMode="cover"
          style={{
            width: screenWidth,
            height: patternHeight + waveHeight,
            backgroundColor: COLORS.lavender,
          }}
        >
          <SafeAreaView edges={['top']} style={styles.logoWrapper}>
            <View style={styles.logoBlob}>
              <Image
                source={require('./assets/images/simbolo.png')}
                resizeMode="contain"
                style={styles.logo}
              />
            </View>
          </SafeAreaView>
        </ImageBackground>

        {/* Painel roxo com borda ondulada */}
        <View style={[styles.panel, { top: patternHeight }]}>
          <Svg
            width={screenWidth}
            height={waveHeight}
            viewBox="0 0 375 70"
            preserveAspectRatio="none"
            style={styles.wave}
          >
            <Path
              d="M0 70 L0 40 C40 5, 90 0, 140 12 C190 24, 220 50, 270 40 C310 32, 340 10, 375 25 L375 70 Z"
              fill={COLORS.purple}
            />
          </Svg>

          <View style={styles.content}>
            <View>
              <Text style={styles.title}>Painel</Text>

              <Text style={styles.description}>
                Você está conectada como pesquisadora. Em breve, aqui você verá as respostas do questionário.
              </Text>
            </View>

            <Pressable
              onPress={sair}
              accessibilityRole="button"
              accessibilityLabel="Sair da conta"
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && { opacity: 0.85 },
              ]}
            >
              <Text style={styles.secondaryButtonText}>SAIR</Text>
            </Pressable>
          </View>
        </View>
      </View>
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
    width: '100%',
    maxWidth: 390,
    flex: 1,
    backgroundColor: COLORS.lavender,
  },

  logoWrapper: {
    alignItems: 'center',
  },

  logoBlob: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 40,
    backgroundColor: COLORS.lavender,
  },

  logo: {
    width: 180,
    height: 46,
  },

  panel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.purple,
  },

  wave: {
    position: 'absolute',
    top: -69,
    left: 0,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },

  title: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 40,
    color: COLORS.cream,
    marginBottom: 8,
  },

  description: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 16,
    lineHeight: 23,
    color: COLORS.cream,
  },

  secondaryButton: {
    alignSelf: 'center',
    width: '85%',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.cream,
    alignItems: 'center',
  },

  secondaryButtonText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 18,
    letterSpacing: 1,
    color: COLORS.cream,
  },
});
