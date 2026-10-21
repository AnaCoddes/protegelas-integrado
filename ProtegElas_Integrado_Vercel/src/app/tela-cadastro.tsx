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

import { cadastrarPesquisadora, loginPesquisadora } from '../services/api';

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
  senha?: string;
  confirmar?: string;
  codigo?: string;
};

export default function CadastroScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [codigo, setCodigo] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const senhaRef = useRef<TextInput>(null);
  const confirmarRef = useRef<TextInput>(null);
  const codigoRef = useRef<TextInput>(null);

  const [fontsLoaded] = useFonts({ SpaceGrotesk_700Bold });

  if (!fontsLoaded) return null;

  const screenWidth = Platform.OS === 'web' ? Math.min(width, 390) : width;
  const waveHeight = 70;
  const patternHeight = height * 0.22;

  const limparErro = (campo: keyof FormErrors) => {
    if (errors[campo]) setErrors((e) => ({ ...e, [campo]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Informe seu e-mail';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      newErrors.email = 'E-mail inválido';
    }

    if (!senha) {
      newErrors.senha = 'Crie uma senha';
    } else if (senha.length < 8) {
      newErrors.senha = 'A senha deve ter ao menos 8 caracteres';
    }

    if (!confirmar) {
      newErrors.confirmar = 'Confirme sua senha';
    } else if (confirmar !== senha) {
      newErrors.confirmar = 'As senhas não conferem';
    }

    if (!codigo.trim()) {
      newErrors.codigo = 'Informe o código de acesso';
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

      await cadastrarPesquisadora(email.trim(), senha, codigo.trim());

      // Conta criada: já entra direto no painel
      await loginPesquisadora(email.trim(), senha);
      router.replace('/painel');
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'Não foi possível criar a conta. Tente novamente.'
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
              <Text style={styles.title}>Criar conta</Text>
              <Text style={styles.description}>
                Cadastro exclusivo para pesquisadoras. Você precisa do código de acesso.
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
                    limparErro('email');
                  }}
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  returnKeyType="next"
                  onSubmitEditing={() => senhaRef.current?.focus()}
                  editable={!loading}
                />
                {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
              </View>

              {/* Senha */}
              <View style={styles.field}>
                <Text style={styles.label}>SENHA</Text>
                <View style={[styles.passwordWrapper, errors.senha && styles.inputError]}>
                  <TextInput
                    ref={senhaRef}
                    style={styles.passwordInput}
                    placeholder="Mínimo de 8 caracteres"
                    placeholderTextColor={COLORS.placeholder}
                    value={senha}
                    onChangeText={(text) => {
                      setSenha(text);
                      limparErro('senha');
                    }}
                    secureTextEntry={!showSenha}
                    autoCapitalize="none"
                    autoComplete="new-password"
                    autoCorrect={false}
                    textContentType="newPassword"
                    returnKeyType="next"
                    onSubmitEditing={() => confirmarRef.current?.focus()}
                    editable={!loading}
                  />
                  <Pressable
                    onPress={() => setShowSenha((v) => !v)}
                    hitSlop={10}
                    accessibilityRole="button"
                    accessibilityLabel={showSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    <Text style={styles.toggleText}>{showSenha ? 'OCULTAR' : 'MOSTRAR'}</Text>
                  </Pressable>
                </View>
                {errors.senha ? <Text style={styles.errorText}>{errors.senha}</Text> : null}
              </View>

              {/* Confirmar senha */}
              <View style={styles.field}>
                <Text style={styles.label}>CONFIRMAR SENHA</Text>
                <TextInput
                  ref={confirmarRef}
                  style={[styles.input, errors.confirmar && styles.inputError]}
                  placeholder="Repita a senha"
                  placeholderTextColor={COLORS.placeholder}
                  value={confirmar}
                  onChangeText={(text) => {
                    setConfirmar(text);
                    limparErro('confirmar');
                  }}
                  secureTextEntry={!showSenha}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  autoCorrect={false}
                  textContentType="newPassword"
                  returnKeyType="next"
                  onSubmitEditing={() => codigoRef.current?.focus()}
                  editable={!loading}
                />
                {errors.confirmar ? (
                  <Text style={styles.errorText}>{errors.confirmar}</Text>
                ) : null}
              </View>

              {/* Código de acesso */}
              <View style={styles.field}>
                <Text style={styles.label}>CÓDIGO DE ACESSO</Text>
                <TextInput
                  ref={codigoRef}
                  style={[styles.input, errors.codigo && styles.inputError]}
                  placeholder="Fornecido pela coordenação"
                  placeholderTextColor={COLORS.placeholder}
                  value={codigo}
                  onChangeText={(text) => {
                    setCodigo(text);
                    limparErro('codigo');
                  }}
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                  editable={!loading}
                />
                {errors.codigo ? <Text style={styles.errorText}>{errors.codigo}</Text> : null}
              </View>

              {formError ? (
                <Text style={[styles.errorText, styles.formError]}>{formError}</Text>
              ) : null}

              {/* Botão principal */}
              <Pressable
                onPress={handleSubmit}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel="Criar conta"
                style={({ pressed }) => [
                  styles.button,
                  pressed && { opacity: 0.85 },
                  loading && { opacity: 0.6 },
                ]}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.cream} />
                ) : (
                  <Text style={styles.buttonText}>CRIAR</Text>
                )}
              </Pressable>

              {/* Já tenho conta */}
              <Pressable
                onPress={() => router.replace('/tela-login')} // ajuste se o nome da sua rota de login for outro
                accessibilityRole="button"
                accessibilityLabel="Já tenho conta"
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && { opacity: 0.85 },
                ]}
              >
                <Text style={styles.secondaryButtonText}>JÁ TENHO CONTA</Text>
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
    fontSize: 18,
    letterSpacing: 1,
    color: COLORS.cream,
  },

  secondaryButton: {
    alignSelf: 'center',
    width: '60%',
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
