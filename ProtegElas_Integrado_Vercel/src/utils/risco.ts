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