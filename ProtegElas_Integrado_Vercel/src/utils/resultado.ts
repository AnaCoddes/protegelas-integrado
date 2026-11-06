// Os 3 níveis de risco possível
export type NivelRisco = "moderado" | "grave" | "extremo";

// Como cada texto de resultado é organizado

export type ResultadoRisco = {
    titulo: string;
    introducao: string;
    recomendacaoTitulo: string;
    recomendacoes: string[];
};

// Recomendações que se repetem em mais de um nível

const PESQUISE = "Pesquise sobre o que é violência doméstica e quais são seus tipos. Além da violência física, existem violências psicológica, sexual, moral, patrimonial e vicária.";
const REDE_PROTECAO = "Informe-se sobre a rede de proteção e cuidado do seu município - locais onde você possa receber orientação, acolhimento e atendimento - e como denunciar um caso de violência doméstica.";

export const RESULTADOS: Record<NivelRisco, ResultadoRisco> = {
  moderado: {
    titulo: "Risco moderado",
    introducao: "Existem sinais de violência no seu relacionamento, e é importante levá-los a sério. Mesmo quando a violência parece pouco grave, ela pode se intensificar rapidamente e colocar sua segurança em risco.",
    recomendacaoTitulo: "É recomendado que você:",
    recomendacoes: [
      "Repense seu relacionamento.",
      "Construa ou fortaleça sua rede de apoio (pessoas que você pode confiar e recorrer em um momento de crise).",
      PESQUISE,
      REDE_PROTECAO,
    ],
  },

  grave: {
    titulo: "Risco grave",
    introducao: "Você está passando por violência doméstica no seu relacionamento. A violência pode se agravar rapidamente, por isso é importante buscar apoio e pensar em formas de se proteger. Esses acontecimentos não devem ser ignorados, fique alerta.",
    recomendacaoTitulo: "É recomendado que você:",
    recomendacoes: [
      "Construa ou fortaleça sua rede de apoio (pessoas que você pode confiar e recorrer em um momento de crise) e a acione.",
      "Esteja alerta aos sinais de perigo! Não subestime atos de ciúmes, agressividade, ameaças e agressões leves.",
      "Repense se estar em uma relação com essa pessoa faz sentido para você. Se for possível e seguro, considere romper esse relacionamento. Planeje esse processo com apoio, considerando sua segurança.",
      PESQUISE,
      REDE_PROTECAO,
      "Em caso de ameaça ou perigo imediato, procure um local seguro e acione os serviços de emergência.",
    ],
  },

  extremo: {
    titulo: "Risco extremo",
    introducao: "ATENÇÃO: os sinais identificados indicam um risco muito elevado. É importante que você não subestime a iminência do risco, sua segurança precisa ser priorizada. Não espere que a violência se agrave para buscar ajuda.",
    recomendacaoTitulo: "É importante que você:",
    recomendacoes: [
      "Busque uma delegacia, preferencialmente a Delegacia Especializada de Atendimento à Mulher (DEAM), se houver no seu município, ou outro serviço da rede de proteção.",
      "Contate sua rede de apoio (pessoas que você pode confiar e recorrer em um momento de crise). Busque ajuda das pessoas que você confia!",
      REDE_PROTECAO,
    ],
  },
};