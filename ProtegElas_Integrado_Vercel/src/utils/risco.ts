import type { NivelRisco } from "./resultado";

// Peso de cada pergunta, na MESMA ORDEM da lista de perguntas do formulário
// 1 = risco moderado; 1,5 = risco grave; 2 = risco extremo

const PESOS: number[] = [
    ...Array(7).fill(1), // perguntas de 1 a 7
    ...Array(32).fill(1.5), // perguntas de 8 a 39
    ...Array(9).fill(2), // perguntas de 40 a 48
];

// Soma o peso das perguntas que a usuária marcou
// "respostas" guarda { "texto da pergunta": true ou false }

export function calcularPontuacao(
    perguntas: string[],
    respostas: Record<string, boolean>,
): number {
    let total = 0;
    perguntas.forEach((pergunta, posicao) => {
        if (respostas[pergunta]) {
            total += PESOS[posicao];
        }
    });

    return total;
}

// Cortes: a partir de quantos pontos muda de nível. Serão testados valores PROVISÓRIOS, pois essa etapa precisa ser decidida pelas pesquisadoras
// Necessário trocar os valores provisórios pelos valores REAIS/OFICIAIS das pesquisadoras futuramente
const CORTE_GRAVE = 20;
const CORTE_EXTREMO = 40;

// Recebe a pontuação e devolve o nível de risco
export function classificarNivel(pontuacao: number): NivelRisco {
    if (pontuacao >= CORTE_EXTREMO) return "extremo";
    if (pontuacao >= CORTE_GRAVE) return "grave";
    return "moderado";
}