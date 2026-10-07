import {
  SpaceGrotesk_700Bold,
  useFonts,
} from '@expo-google-fonts/space-grotesk';

import { useRouter } from 'expo-router';
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


const COLORS = {
  lavender: '#D9C6EE',
  purple: '#6B2A85',
  button: '#B08BD0',
  cream: '#FFF1DC',
};

type Props = {
  onStart?: () => void;
};

export default function HomeScreen({ onStart }: Props) {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

const screenWidth = Platform.OS === 'web' ? Math.min(width, 390) : width;
const screenHeight = height;

  const [fontsLoaded] = useFonts({ SpaceGrotesk_700Bold });

  if (!fontsLoaded) return null;

  const waveHeight = 70;
  const patternHeight = screenHeight * 0.5;

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
            <Text style={styles.title}>Bem-vinda!</Text>

            <Text style={styles.description}>
              Esse questionário ajuda a identificar sinais de violência doméstica e risco de feminicídio no seu relacionamento.
               Ao clicar no botão abaixo, você verá algumas frases. Marque aquelas que representam situações que você costuma vivenciar.
            </Text>

            <Pressable
              onPress={() => router.push('/formulario')}              accessibilityRole="button"
              accessibilityLabel="Iniciar questionário"
              style={({ pressed }) => [
              styles.button,
              pressed && { opacity: 0.85 },
              ]}
            >
              <Text style={styles.buttonText}>INICIAR</Text>
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

  button: {
    alignSelf: 'center',
    width: '85%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.button,
    alignItems: 'center',
  },

  buttonText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 34,
    letterSpacing: 1,
    color: COLORS.cream,
  },
});