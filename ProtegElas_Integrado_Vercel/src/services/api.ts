import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// URL do backend. Defina EXPO_PUBLIC_API_URL no .env da raiz do app.
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';
const TOKEN_KEY = 'token_pesquisadora';

/* ---------- Token da pesquisadora ---------- */

export async function salvarToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    sessionStorage.setItem(TOKEN_KEY, token);
    return;
  }
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function lerToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return sessionStorage.getItem(TOKEN_KEY);
  }
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function removerToken(): Promise<void> {
  if (Platform.OS === 'web') {
    sessionStorage.removeItem(TOKEN_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

/* ---------- Requisição base ---------- */

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let res: Response;

  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor.');
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      (data as { erro?: string }).erro ?? `Erro inesperado (código ${res.status}). Tente novamente.`
    );
  }

  return data as T;
}

/* ---------- Pesquisadoras ---------- */

export async function loginPesquisadora(email: string, senha: string): Promise<void> {
  const { token } = await request<{ token: string }>('/pesquisadoras/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  });

  await salvarToken(token);
}

export async function cadastrarPesquisadora(
  email: string,
  senha: string,
  codigo: string
): Promise<void> {
  await request<{ id: number; email: string }>('/pesquisadoras/cadastro', {
    method: 'POST',
    body: JSON.stringify({ email, senha, codigo }),
  });
}

export type Resposta = {
  id: number;
  respostas: Record<string, unknown>;
  latitude: number;
  longitude: number;
  [campo: string]: unknown;
};

export async function listarRespostas(): Promise<Resposta[]> {
  const token = await lerToken();

  return request<Resposta[]>('/respostas', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/* ---------- Questionário (sem login) ---------- */

export async function enviarRespostas(
  respostas: Record<string, unknown>,
  latitude: number,
  longitude: number
): Promise<Resposta> {
  return request<Resposta>('/respostas', {
    method: 'POST',
    body: JSON.stringify({ respostas, latitude, longitude }),
  });
}