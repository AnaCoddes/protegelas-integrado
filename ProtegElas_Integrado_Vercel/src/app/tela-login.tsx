import {
  SpaceGrotesk_700Bold,
  useFonts,
} from '@expo-google-fonts/space-grotesk';

import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { loginPesquisadora } from '../services/api';

const COLORS = {
  lavender: '#D9C6EE',
  purple: '#6B2A85',
  button: '#B08BD0',
  cream: '#FFF1DC',
  placeholder: '#9B7BB0',
  error: '#FFB4B4',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormErrors = {
  email?: string;
  password?: string;
};

export default function LoginScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef<TextInput>(null);

  const [fontsLoaded] = useFonts({ SpaceGrotesk_700Bold });

  if (!fontsLoaded) return null;

  const screenWidth = Platform.OS === 'web' ? Math.min(width, 390) : width;
  const waveHeight = 70;
  const patternHeight = height * 0.28;

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Informe seu e-mail';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      newErrors.email = 'E-mail inválido';
    }

    if (!password) {
      newErrors.password = 'Informe sua senha';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (loading) return;
    setFormError('');
    if (!validate()) return;

    try {
      setLoading(true);

      await loginPesquisadora(email.trim(), password);

      router.replace('/painel');
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'Não foi possível entrar. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
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

          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.title}>Entrar</Text>
              <Text style={styles.description}>
                Acesso restrito às pesquisadoras.
              </Text>

              {/* E-mail */}
              <View style={styles.field}>
                <Text style={styles.label}>E-MAIL</Text>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="voce@exemplo.com"
                  placeholderTextColor={COLORS.placeholder}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
                  }}
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  editable={!loading}
                />
                {errors.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}
              </View>

              {/* Senha */}
              <View style={styles.field}>
                <Text style={styles.label}>SENHA</Text>
                <View
                  style={[
                    styles.passwordWrapper,
                    errors.password && styles.inputError,
                  ]}
                >
                  <TextInput
                    ref={passwordRef}
                    style={styles.passwordInput}
                    placeholder="Sua senha"
                    placeholderTextColor={COLORS.placeholder}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errors.password)
                        setErrors((e) => ({ ...e, password: undefined }));
                    }}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password"
                    autoCorrect={false}
                    textContentType="password"
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                    editable={!loading}
                  />
                  <Pressable
                    onPress={() => setShowPassword((v) => !v)}
                    hitSlop={10}
                    accessibilityRole="button"
                    accessibilityLabel={
                      showPassword ? 'Ocultar senha' : 'Mostrar senha'
                    }
                  >
                    <Text style={styles.toggleText}>
                      {showPassword ? 'OCULTAR' : 'MOSTRAR'}
                    </Text>
                  </Pressable>
                </View>
                {errors.password ? (
                  <Text style={styles.errorText}>{errors.password}</Text>
                ) : null}
              </View>

              <Pressable
                onPress={() => {}} // TODO: rota de recuperação de senha
                style={styles.forgot}
                hitSlop={8}
              >
                <Text style={styles.link}>Esqueceu a senha?</Text>
              </Pressable>

              {formError ? (
                <Text style={[styles.errorText, styles.formError]}>
                  {formError}
                </Text>
              ) : null}

              {/* Botão principal */}
              <Pressable
                onPress={handleSubmit}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel="Entrar"
                style={({ pressed }) => [
                  styles.button,
                  pressed && { opacity: 0.85 },
                  loading && { opacity: 0.6 },
                ]}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.cream} />
                ) : (
                  <Text style={styles.buttonText}>ENTRAR</Text>
                )}
              </Pressable>

              {/* Criar conta */}
              <Pressable
                onPress={() => router.push('/tela-cadastro')}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Criar conta de pesquisadora"
                style={[styles.forgot, { alignSelf: 'center' }]}
              >
                <Text style={styles.link}>Criar conta de pesquisadora</Text>
              </Pressable>

              {/* Voltar */}
              <Pressable
                onPress={() => router.replace('/')}
                accessibilityRole="button"
                accessibilityLabel="Voltar ao início"
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && { opacity: 0.85 },
                ]}
              >
                <Text style={styles.secondaryButtonText}>VOLTAR</Text>
              </Pressable>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

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
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 32,
    gap: 14,
  },

  title: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 40,
    color: COLORS.cream,
  },

  description: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 16,
    lineHeight: 23,
    color: COLORS.cream,
    marginTop: -8,
  },

  field: {
    gap: 6,
  },

  label: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 13,
    letterSpacing: 1,
    color: COLORS.cream,
  },

  input: {
    height: 52,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    paddingHorizontal: 16,
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 16,
    color: COLORS.purple,
    backgroundColor: COLORS.cream,
  },

  passwordWrapper: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    paddingHorizontal: 16,
    backgroundColor: COLORS.cream,
  },

  passwordInput: {
    flex: 1,
    height: '100%',
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 16,
    color: COLORS.purple,
  },

  toggleText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 12,
    letterSpacing: 1,
    color: COLORS.purple,
    marginLeft: 12,
  },

  inputError: {
    borderColor: COLORS.error,
  },

  errorText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 13,
    color: COLORS.error,
  },

  formError: {
    textAlign: 'center',
  },

  forgot: {
    alignSelf: 'flex-end',
  },

  link: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 14,
    color: COLORS.cream,
    textDecorationLine: 'underline',
  },

  button: {
    alignSelf: 'center',
    width: '70%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.button,
    alignItems: 'center',
    marginTop: 4,
  },

  buttonText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 24,
    letterSpacing: 1,
    color: COLORS.cream,
  },

  secondaryButton: {
    alignSelf: 'center',
    width: '70%',
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
