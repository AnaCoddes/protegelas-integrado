// Ícone do ProtegELAS

import Svg, { Circle, Line, Path } from "react-native-svg";

export default function LogoIcone() {
  return (
    <Svg width={58} height={58} viewBox="0 0 58 58">
      {/* Escudo */}
      <Path
        d="M29 4
        C21 4 14 6 8 10
        V27
        C8 39 17 49 29 54
        C41 49 50 39 50 27
        V10
        C44 6 37 4 29 4Z"
        fill="none"
        stroke="#66268C"
        strokeWidth={4}
        strokeLinejoin="round"
      />

      {/* Cabeça */}
      <Circle
        cx="29"
        cy="23"
        r="8"
        fill="none"
        stroke="#66268C"
        strokeWidth={4}
      />

      {/* corpo / símbolo feminino */}
      <Line
        x1="29"
        y1="31"
        x2="29"
        y2="45"
        stroke="#66268C"
        strokeWidth={4}
        strokeLinecap="round"
      />

      <Line
        x1="22"
        y1="37"
        x2="36"
        y2="37"
        stroke="#66268C"
        strokeWidth={4}
        strokeLinecap="round"
      />
    </Svg>
  );
}
